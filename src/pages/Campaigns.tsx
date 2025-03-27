import React, { useState } from 'react';
import { Plus, Filter, Calendar, Users, BarChart3 } from 'lucide-react';
import CreateCampaignModal from '../components/modals/CreateCampaignModal';

const Campaigns = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const campaigns = [
    {
      name: "Summer Collection Launch",
      status: "active",
      influencers: 8,
      budget: "$25,000",
      reach: "1.2M",
      engagement: "4.8%",
      start: "2024-06-01",
      end: "2024-07-15"
    },
    {
      name: "Holiday Special",
      status: "planning",
      influencers: 12,
      budget: "$40,000",
      reach: "-",
      engagement: "-",
      start: "2024-11-15",
      end: "2024-12-31"
    },
    {
      name: "Brand Awareness",
      status: "completed",
      influencers: 5,
      budget: "$15,000",
      reach: "800K",
      engagement: "5.2%",
      start: "2024-03-01",
      end: "2024-04-15"
    }
  ];

  const filteredCampaigns = selectedStatus === 'all'
    ? campaigns
    : campaigns.filter(campaign => campaign.status === selectedStatus);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          <Plus size={20} className="mr-2" />
          New Campaign
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <button className="flex items-center px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
              <Filter size={20} className="mr-2" />
              Filter
            </button>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg text-gray-600"
            >
              <option value="all">All Campaigns</option>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <button className="text-gray-500 hover:text-gray-700">
              <Calendar size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-700">
              <BarChart3 size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredCampaigns.map((campaign) => (
            <CampaignRow key={campaign.name} {...campaign} />
          ))}
        </div>
      </div>

      <CreateCampaignModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

const CampaignRow = ({ 
  name, 
  status, 
  influencers, 
  budget, 
  reach, 
  engagement,
  start,
  end
}: {
  name: string;
  status: string;
  influencers: number;
  budget: string;
  reach: string;
  engagement: string;
  start: string;
  end: string;
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
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex items-center space-x-4">
        <div>
          <h3 className="font-medium text-gray-900">{name}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(status)}`}>
              {status}
            </span>
            <span className="text-sm text-gray-500">
              {start} - {end}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-8">
        <div className="text-sm">
          <p className="text-gray-500">Influencers</p>
          <div className="flex items-center mt-1">
            <Users size={16} className="text-gray-400 mr-1" />
            <span className="font-medium text-gray-900">{influencers}</span>
          </div>
        </div>

        <div className="text-sm">
          <p className="text-gray-500">Budget</p>
          <p className="font-medium text-gray-900">{budget}</p>
        </div>

        <div className="text-sm">
          <p className="text-gray-500">Reach</p>
          <p className="font-medium text-gray-900">{reach}</p>
        </div>

        <div className="text-sm">
          <p className="text-gray-500">Engagement</p>
          <p className="font-medium text-gray-900">{engagement}</p>
        </div>

        <button className="text-teal-600 hover:text-teal-700 font-medium">
          View Details
        </button>
      </div>
    </div>
  );
};

export default Campaigns;