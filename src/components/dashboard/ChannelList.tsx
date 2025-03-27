import React, { useState } from 'react';
import { Hash, Users, Megaphone, BookOpen, MessageCircle, Calendar, Plus, Settings, ChevronRight, Search, Code, Microscope, Calculator, Palette, Music } from 'lucide-react';
import CreateChannelModal from '../CreateChannelModal';

interface ChannelListProps {
  serverId: string;
  activeChannel: string;
  setActiveChannel: (channel: string) => void;
  setActiveServer: (server: string) => void;
}

export default function ChannelList({ serverId, activeChannel, setActiveChannel, setActiveServer }: ChannelListProps) {
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);

  const [servers] = useState([
    { 
      id: 'cs101', 
      name: 'Computer Science 101', 
      icon: Code,
      color: 'bg-blue-100 text-blue-600',
      members: 1234
    },
    { 
      id: 'biology', 
      name: 'Biology Research', 
      icon: Microscope,
      color: 'bg-green-100 text-green-600',
      members: 567
    },
    { 
      id: 'math', 
      name: 'Mathematics Hub', 
      icon: Calculator,
      color: 'bg-purple-100 text-purple-600',
      members: 890
    },
    { 
      id: 'arts', 
      name: 'Creative Arts', 
      icon: Palette,
      color: 'bg-pink-100 text-pink-600',
      members: 432
    },
    { 
      id: 'music', 
      name: 'Music Theory', 
      icon: Music,
      color: 'bg-yellow-100 text-yellow-600',
      members: 321
    }
  ]);

  const [channels] = useState({
    cs101: [
      { id: 'announcements', name: 'Announcements', icon: Megaphone },
      { id: 'general', name: 'General Discussion', icon: MessageCircle },
      { id: 'assignments', name: 'Assignments', icon: BookOpen },
      { id: 'study-groups', name: 'Study Groups', icon: Users },
      { id: 'events', name: 'Events', icon: Calendar },
    ],
    biology: [
      { id: 'lab-updates', name: 'Lab Updates', icon: Megaphone },
      { id: 'research', name: 'Research Discussion', icon: MessageCircle },
      { id: 'study-material', name: 'Study Material', icon: BookOpen },
    ],
  });

  const handleCreateChannel = async (channelData: { name: string; type: 'text' | 'voice'; isPrivate: boolean }) => {
    const newChannel = {
      id: channelData.name.toLowerCase().replace(/\s+/g, '-'),
      name: channelData.name,
      icon: channelData.type === 'text' ? MessageCircle : Users,
    };

    setChannels(prev => ({
      ...prev,
      [serverId]: [...(prev[serverId as keyof typeof prev] || []), newChannel]
    }));
    setActiveChannel(newChannel.id);
  };

  const currentChannels = channels[serverId as keyof typeof channels] || [];
  const currentServer = servers.find(s => s.id === serverId);

  return (
    <>
      <div className="w-80 bg-white border-r flex flex-col">
        {/* Server Selection Bar */}
        <div className="p-4 border-b overflow-x-auto">
          <div className="flex space-x-2">
            {servers.map((server) => {
              const ServerIcon = server.icon;
              return (
                <button
                  key={server.id}
                  onClick={() => {
                    setActiveServer(server.id);
                    setActiveChannel('general');
                  }}
                  className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
                    ${serverId === server.id 
                      ? server.color
                      : 'hover:bg-gray-100 text-gray-600'}`}
                  title={server.name}
                >
                  <ServerIcon className="w-6 h-6" />
                </button>
              );
            })}
            <button
              onClick={() => setIsCreateChannelModalOpen(true)}
              className="flex-shrink-0 w-12 h-12 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-600"
              title="Create Server"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Current Server Info */}
        {currentServer && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{currentServer.name}</h2>
                  <p className="text-sm text-gray-500">{currentServer.members.toLocaleString()} members</p>
                </div>
                <button
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  title="Server Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Channels
                    </h3>
                    <button
                      onClick={() => setIsCreateChannelModalOpen(true)}
                      className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"
                      title="Create Channel"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {currentChannels.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => setActiveChannel(channel.id)}
                        className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors
                          ${activeChannel === channel.id 
                            ? 'bg-teal-50 text-teal-600' 
                            : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        <channel.icon className="w-4 h-4 mr-3" />
                        {channel.name}
                        <ChevronRight className={`w-4 h-4 ml-auto transition-transform
                          ${activeChannel === channel.id ? 'rotate-90' : ''}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Online Members
                  </h3>
                  <div className="space-y-2">
                    {[
                      { name: 'Sarah Johnson', status: 'online' },
                      { name: 'Michael Chen', status: 'idle' },
                      { name: 'Emily Rodriguez', status: 'dnd' },
                    ].map((member, index) => (
                      <div key={index} className="flex items-center px-3 py-2 rounded-lg text-sm text-gray-600">
                        <div className={`w-2 h-2 rounded-full mr-3 
                          ${member.status === 'online' ? 'bg-green-400' : 
                            member.status === 'idle' ? 'bg-yellow-400' : 'bg-red-400'}`} 
                        />
                        {member.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <CreateChannelModal
        isOpen={isCreateChannelModalOpen}
        onClose={() => setIsCreateChannelModalOpen(false)}
        onCreateChannel={handleCreateChannel}
      />
    </>
  );
}