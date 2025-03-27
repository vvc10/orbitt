import React, { useState, useEffect } from 'react';
import { Bell, Home, Compass, Users, Settings, Hash, MessageCircle, Plus, LogOut } from 'lucide-react';
import { collection, addDoc, getDocs, doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db, auth } from '../firebase';
import Chat from './dashboard/Chat';
import HomePage from './dashboard/Home';
import Explore from './dashboard/Explore';
import CreateServerModal from './CreateServerModal';
import CreateChannelModal from './CreateChannelModal';
import UserSettingsModal from './modals/UserSettingModal';
import UserProfileModal from './modals/UserProfileModal';
import { User } from 'firebase/auth';

interface DashboardProps {
  setLoginState: (state: boolean) => void;
  isAdmin: boolean;
}

interface Server {
  id: string;
  name: string;
  iconUrl?: string;
  coverUrl?: string;
  color: string;
  description?: string;
  members: string[];
  membersCount: number;
  owner: string;
  channels: Array<{
    name: string;
    type: 'text' | 'voice' | 'announcement';
    isPrivate: boolean;
  }>;
}

export default function Dashboard({ setLoginState, isAdmin }: DashboardProps) {
  const [activePage, setActivePage] = useState<'home' | 'explore' | 'server'>('home');
  const [activeServer, setActiveServer] = useState('');
  const [activeChannel, setActiveChannel] = useState('general');
  const [notifications] = useState(3);
  const [isCreateServerModalOpen, setIsCreateServerModalOpen] = useState(false);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [servers, setServers] = useState<Server[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [channels, setChannels] = useState<{ id: string; name: string; type?: string; icon: any }[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'servers'));
        const serverData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          members: doc.data().members || [],
          membersCount: doc.data().membersCount || 0,
          channels: doc.data().channels || [
            { name: 'general', type: 'text', isPrivate: false },
            { name: 'announcements', type: 'announcement', isPrivate: false }
          ]
        })) as Server[];
        setServers(serverData);
      } catch (error) {
        console.error('Error fetching servers:', error);
      }
    };

    if (auth.currentUser) {
      fetchServers();
    }
  }, []);

  const joinedServers = React.useMemo(() => 
    servers.filter(server => server.members.includes(user?.uid || '')),
    [servers, user]
  );

  const handleJoinServer = async (serverId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const serverRef = doc(db, 'servers', serverId);
      await updateDoc(serverRef, {
        members: arrayUnion(user.uid),
        membersCount: increment(1)
      });

      setServers(prev => prev.map(server =>
        server.id === serverId
          ? {
            ...server,
            members: [...server.members, user.uid],
            membersCount: server.membersCount + 1
          }
          : server
      ));

    } catch (error) {
      console.error('Error joining server:', error);
    }
  };

  const handleCreateServer = async (serverData: {
    name: string;
    description: string;
    isPublic: boolean;
    icon?: File;
    cover?: File;
  }) => {
    try {
      if (!auth.currentUser) throw new Error("User not authenticated");

      const gradients = [
        'from-blue-500 to-purple-600',
        'from-cyan-500 to-blue-600',
        'from-green-500 to-emerald-600',
        'from-pink-500 to-rose-600',
        'from-violet-500 to-purple-600',
        'from-orange-500 to-red-600'
      ];
      const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

      // Create server with default channels
      const newServer = {
        name: serverData.name,
        description: serverData.description,
        isPublic: serverData.isPublic,
        color: randomGradient,
        createdAt: new Date().toISOString(),
        owner: auth.currentUser.uid,
        members: [auth.currentUser.uid],
        membersCount: 1,
        channels: [
          { name: 'announcements', type: 'announcement', isPrivate: false },
          { name: 'general', type: 'text', isPrivate: false }
        ]
      };

      const docRef = await addDoc(collection(db, 'servers'), newServer);
      setServers(prev => [...prev, { id: docRef.id, ...newServer }]);
      setIsCreateServerModalOpen(false);
      handleServerClick(docRef.id);
    } catch (error) {
      console.error('Error creating server:', error);
    }
  };

  const handleCreateChannel = async (channelData: {
    name: string;
    type: 'text' | 'voice' | 'announcement';
    isPrivate: boolean;
  }) => {
    try {
      if (!activeServer) throw new Error("No server selected");
      if (!auth.currentUser) throw new Error("User not authenticated");

      const serverRef = doc(db, 'servers', activeServer);
      const newChannel = {
        name: channelData.name,
        type: channelData.type,
        isPrivate: channelData.isPrivate
      };

      await updateDoc(serverRef, {
        channels: arrayUnion(newChannel)
      });

      const channelIcon = channelData.type === 'text' ? MessageCircle : 
                         channelData.type === 'voice' ? Users : 
                         Bell;

      setChannels(prev => [...prev, {
        id: channelData.name.toLowerCase().replace(/\s+/g, '-'),
        name: channelData.name,
        type: channelData.type,
        icon: channelIcon
      }]);

      setServers(prev => prev.map(server =>
        server.id === activeServer
          ? { ...server, channels: [...server.channels, newChannel] }
          : server
      ));

      setIsCreateChannelModalOpen(false);
      setActiveChannel(channelData.name.toLowerCase().replace(/\s+/g, '-'));
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  const handleServerClick = (serverId: string) => {
    setActivePage('server');
    setActiveServer(serverId);
    
    const selectedServer = servers.find(s => s.id === serverId);
    if (selectedServer) {
      // Set active channel to the first available channel
      const firstChannel = selectedServer.channels[0];
      setActiveChannel(firstChannel.name.toLowerCase().replace(/\s+/g, '-'));

      // Map channels with their appropriate icons
      setChannels(selectedServer.channels.map(channel => ({
        id: channel.name.toLowerCase().replace(/\s+/g, '-'),
        name: channel.name,
        type: channel.type,
        icon: channel.type === 'text' ? MessageCircle : 
              channel.type === 'voice' ? Users : 
              Bell
      })));
    }
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    setIsProfileModalOpen(true);
  };

  const renderChannels = () => (
    <div className="px-2 py-4">
      <div className="mb-4">
        <div className="px-2 mb-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Channels</h3>
          <button
            onClick={() => setIsCreateChannelModalOpen(true)}
            className="text-gray-400 hover:text-gray-200 p-1 rounded hover:bg-[#3e3e3e] transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => setActiveChannel(channel.id)}
            className={`w-full flex items-center px-2 py-1.5 rounded-md text-sm transition-colors duration-200 ${
              activeChannel === channel.id
                ? 'text-white bg-[#3e3e3e]'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#3e3e3e]'
            }`}
          >
            <channel.icon className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{channel.name}</span>
            {channel.type === 'voice' && (
              <span className="ml-auto text-xs text-gray-500">🎤</span>
            )}
            {channel.type === 'announcement' && (
              <span className="ml-auto text-xs text-gray-500">📢</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderMainContent = () => {
    const currentChannel = channels.find(c => c.id === activeChannel);
    
    if (currentChannel?.type === 'voice') {
      return (
        <div className="flex-1 flex items-center justify-center bg-[#363636]">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#2e2e2e] rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Voice Channel</h3>
            <p className="text-gray-400 mb-4">Join the voice chat to communicate with others</p>
            <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              Join Voice
            </button>
          </div>
        </div>
      );
    }

    return (
      <Chat 
        serverId={activeServer} 
        channelId={activeChannel}
        channelType={currentChannel?.type || 'text'}
      />
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#1a1a1a]">
      <div className="w-16 bg-[#1e1e1e] flex flex-col items-center py-4 space-y-2">
        <button
          onClick={() => setActivePage('home')}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200
            ${activePage === 'home' ? 'bg-teal-600 text-white' : 'bg-[#2e2e2e] text-gray-400 hover:bg-[#3e3e3e] hover:text-white'}`}
        >
          <Home className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => setActivePage('explore')}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200
            ${activePage === 'explore' ? 'bg-teal-600 text-white' : 'bg-[#2e2e2e] text-gray-400 hover:bg-[#3e3e3e] hover:text-white'}`}
        >
          <Compass className="w-6 h-6" />
        </button>

        <div className="w-8 h-px bg-gray-700 my-2" />

        <div className="flex-1 w-full px-2 space-y-2 overflow-y-auto">
          {joinedServers.map((server) => (
            <button
              key={server.id}
              onClick={() => handleServerClick(server.id)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 relative group
                ${activePage === 'server' && activeServer === server.id
                  ? 'bg-teal-600'
                  : 'bg-[#2e2e2e] hover:bg-[#3e3e3e]'}`}
            >
              {server.iconUrl ? (
                <img
                  src={server.iconUrl}
                  alt={server.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
              ) : (
                <div className={`w-8 h-8 rounded-lg ${server.color} flex items-center justify-center text-white font-medium`}>
                  {server.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full scale-0 group-hover:scale-100 transition-transform duration-200
                ${activePage === 'server' && activeServer === server.id ? 'scale-100' : ''}" />
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setIsCreateServerModalOpen(true)}
            className="w-12 h-12 rounded-2xl bg-[#2e2e2e] hover:bg-[#3e3e3e] flex items-center justify-center text-green-500 hover:text-green-400 transition-colors duration-200"
          >
            <Plus className="w-6 h-6" />
          </button>

          <button className="relative w-12 h-12 rounded-2xl bg-[#2e2e2e] hover:bg-[#3e3e3e] flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-200">
            <Bell className="w-6 h-6" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                {notifications}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="w-12 h-12 rounded-2xl bg-[#2e2e2e] hover:bg-[#3e3e3e] flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-200"
          >
            <Settings className="w-6 h-6" />
          </button>

          <button
            onClick={() => {
              auth.signOut();
              setLoginState(false);
            }}
            className="w-12 h-12 rounded-2xl bg-[#2e2e2e] hover:bg-[#3e3e3e] flex items-center justify-center text-gray-400 hover:text-white transition-colors duration-200"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {activePage === 'server' ? (
        <>
          <div className="w-60 bg-[#2e2e2e] flex flex-col">
            <div className="h-16 px-4 flex items-center border-b border-[#1a1a1a]">
              {servers.find(s => s.id === activeServer)?.coverUrl && (
                <div className="absolute top-0 left-0 w-full h-24 z-0">
                  <img
                    src={servers.find(s => s.id === activeServer)?.coverUrl}
                    alt="Server cover"
                    className="w-full h-full object-cover opacity-20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2e2e2e]" />
                </div>
              )}
              <div className="relative z-10 flex items-center justify-between w-full">
                <h2 className="text-white font-medium truncate">
                  {servers.find(s => s.id === activeServer)?.name}
                </h2>
                <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-200" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {renderChannels()}
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-[#363636]">
            <div className="h-16 bg-[#2e2e2e] border-b border-[#1a1a1a] flex items-center px-4">
              <div className="flex items-center text-gray-200">
                <Hash className="w-5 h-5 mr-2" />
                <span className="font-medium">{channels.find(c => c.id === activeChannel)?.name}</span>
                {channels.find(c => c.id === activeChannel)?.type === 'announcement' && (
                  <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
                    Announcement Channel
                  </span>
                )}
              </div>
            </div>
            {renderMainContent()}
          </div>
        </>
      ) : (
        <div className="flex-1 bg-[#363636]">
          {activePage === 'home' ? (
            <HomePage onServerClick={handleServerClick} joinedServers={joinedServers} user={user} />
          ) : (
            <Explore user={user} onJoinServer={handleJoinServer} servers={servers} />
          )}
        </div>
      )}

      <CreateServerModal
        isOpen={isCreateServerModalOpen}
        onClose={() => setIsCreateServerModalOpen(false)}
        onCreateServer={handleCreateServer}
      />

      <CreateChannelModal
        isOpen={isCreateChannelModalOpen}
        onClose={() => setIsCreateChannelModalOpen(false)}
        onCreateChannel={handleCreateChannel}
      />

      <UserSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userId={selectedUserId}
      />
    </div>
  );
}