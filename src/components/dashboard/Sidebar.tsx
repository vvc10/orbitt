import React from 'react';
import { 
  Home, 
  Calendar, 
  MessageSquare, 
  Bell, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isAdmin: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, isAdmin }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: 'Overview' },
    { icon: Calendar, label: 'Schedule' },
    { icon: MessageSquare, label: 'Messages' },
    { icon: Bell, label: 'Notifications' },
    { icon: Users, label: 'Groups' },
    { icon: BookOpen, label: 'Resources' },
    { icon: Settings, label: 'Settings' },
  ];

  if (isAdmin) {
    menuItems.push({ icon: Users, label: 'User Management' });
  }

  return (
    <div className="w-64 bg-white h-screen shadow-sm flex flex-col">
      <div className="p-6 flex-1">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800">orbitt</h2>
          <p className="text-sm text-gray-500">{isAdmin ? 'Admin Panel' : 'Student Dashboard'}</p>
        </div>

        <nav className="space-y-2">
          {menuItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => setActiveTab(label.toLowerCase())}
              className={`w-full flex items-center px-4 py-2 rounded-lg text-sm ${
                activeTab === label.toLowerCase()
                  ? 'bg-teal-50 text-teal-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mr-3" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}