import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BookOpen,
  Code,
  Microscope,
  Calculator,
  Music,
  Palette,
  Plus,
  Compass,
  Home,
  Users,
  Settings,
} from 'lucide-react';
import CreateServerModal from '../CreateServerModal';

interface ServerProps {
  activeServer: string;
  setActiveServer: (server: string) => void;
}

interface Server {
  _id: string;
  name: string;
  icon: string; // URL to the server icon
  color: string; // Tailwind CSS color classes
}

export default function ServerList({ activeServer, setActiveServer }: ServerProps) {
  const [isCreateServerModalOpen, setIsCreateServerModalOpen] = useState(false);
  const [servers, setServers] = useState<Server[]>([]);

  // Fetch servers from the database
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await axios.get('/api/servers'); // Adjust the endpoint as needed
        setServers(response.data);
      } catch (error) {
        console.error('Error fetching servers:', error);
      }
    };

    fetchServers();
  }, []);

  // Handle creating a new server
  const handleCreateServer = async (serverData: { name: string; icon?: File }) => {
    try {
      // Prepare form data for uploading the icon
      const formData = new FormData();
      formData.append('name', serverData.name);
      if (serverData.icon) {
        formData.append('icon', serverData.icon);
      }

      const response = await axios.post('/api/servers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newServer = response.data;
      setServers([...servers, newServer]);
      setActiveServer(newServer._id);
    } catch (error) {
      console.error('Error creating server:', error);
    }
  };

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'communities', icon: Users, label: 'Communities' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      <div className="w-20 bg-gray-50 border-r flex flex-col items-center py-4 space-y-4">
        {/* Navigation Items */}
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveServer(item.id)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 ${
              activeServer === item.id
                ? 'bg-teal-100 text-teal-600'
                : 'hover:bg-gray-200 text-gray-600'
            }`}
            title={item.label}
          >
            <item.icon className="w-6 h-6" />
          </button>
        ))}

        <div className="w-12 h-px bg-gray-200" />

        {/* Server List */}
        <div className="flex-1 w-full px-3 space-y-3 overflow-y-auto">
          {servers.map((server) => (
            <button
              key={server._id}
              onClick={() => setActiveServer(server._id)}
              className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-200 ${
                activeServer === server._id
                  ? server.color
                  : 'hover:bg-gray-200 text-gray-600'
              }`}
              title={server.name}
            >
              <Code className="w-6 h-6" /> {/* Replace with dynamic icons if needed */}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsCreateServerModalOpen(true)}
          className="w-12 h-12 rounded-xl hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-all duration-200"
          title="Create Server"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <CreateServerModal
        isOpen={isCreateServerModalOpen}
        onClose={() => setIsCreateServerModalOpen(false)}
        onCreateServer={handleCreateServer}
      />
    </>
  );
}
