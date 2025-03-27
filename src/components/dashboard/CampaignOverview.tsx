import React from 'react';
import { TrendingUp, Users, DollarSign } from 'lucide-react';

const CampaignOverview = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Campaign Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Active Campaigns"
          value="12"
          change="+2.5%"
          icon={<TrendingUp className="text-emerald-500" size={24} />}
        />
        <MetricCard
          title="Total Reach"
          value="2.4M"
          change="+12.3%"
          icon={<Users className="text-blue-500" size={24} />}
        />
        <MetricCard
          title="ROI"
          value="386%"
          change="+8.1%"
          icon={<DollarSign className="text-teal-500" size={24} />}
        />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-600 mb-3">Recent Campaigns</h3>
        <div className="space-y-3">
          {[
            { name: 'Summer Collection Launch', status: 'active', progress: 75 },
            { name: 'Holiday Special', status: 'planning', progress: 25 },
            { name: 'Brand Awareness', status: 'completed', progress: 100 }
          ].map((campaign) => (
            <CampaignRow key={campaign.name} {...campaign} />
          ))}
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon 
}: { 
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="p-4 rounded-lg border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-500 text-sm">{title}</span>
        {icon}
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="ml-2 text-sm font-medium text-emerald-500">{change}</span>
      </div>
    </div>
  );
};

const CampaignRow = ({ 
  name, 
  status, 
  progress 
}: { 
  name: string;
  status: string;
  progress: number;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'planning': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <span className="font-medium text-gray-900">{name}</span>
        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(status)}`}>
          {status}
        </span>
      </div>
      <div className="w-24">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-teal-500 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CampaignOverview;