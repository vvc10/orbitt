import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Wallet, 
  Search,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = ({ 
  onPageChange, 
  currentPage 
}: { 
  onPageChange: (page: string) => void;
  currentPage: string;
}) => {
  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-teal-600">Influence.ai</h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        <Sidebara 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          active={currentPage === 'dashboard'}
          onClick={() => onPageChange('dashboard')}
        />
        <Sidebara 
          icon={<Users size={20} />} 
          label="Campaigns" 
          active={currentPage === 'campaigns'}
          onClick={() => onPageChange('campaigns')}
        />
        <Sidebara 
          icon={<BarChart3 size={20} />} 
          label="Analytics" 
          active={currentPage === 'analytics'}
          onClick={() => onPageChange('analytics')}
        />
        <Sidebara 
          icon={<Wallet size={20} />} 
          label="Budget" 
          active={currentPage === 'budget'}
          onClick={() => onPageChange('budget')} />
        <Sidebara 
          icon={<Search size={20} />} 
          label="Discover" 
          active={currentPage === 'discover'}
          onClick={() => onPageChange('discover')}
        />
      </nav>

      <div className="p-4 border-t border-gray-200">
        <Sidebara icon={<Settings size={20} />} label="Settings" />
        <Sidebara icon={<LogOut size={20} />} label="Logout" />
      </div>
    </div>
  );
};

const Sidebara = ({ 
  icon, 
  label, 
  active = false,
  onClick
}: { 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        active 
          ? 'bg-teal-50 text-teal-600' 
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default Sidebar;