import React from 'react';
import { Star, TrendingUp, Users } from 'lucide-react';

const InfluencerSuggestions = () => {
  const influencers = [
    {
      name: 'Sarah Johnson',
      handle: '@sarahjstyle',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      category: 'Fashion & Lifestyle',
      engagement: '4.8%',
      followers: '125K',
      matchScore: 92
    },
    {
      name: 'Mike Chen',
      handle: '@mikefoodie',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      category: 'Food & Travel',
      engagement: '5.2%',
      followers: '89K',
      matchScore: 88
    },
    {
      name: 'Emma Wilson',
      handle: '@emmafitness',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      category: 'Health & Fitness',
      engagement: '6.1%',
      followers: '220K',
      matchScore: 85
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">AI-Recommended Influencers</h2>
        <button className="text-teal-600 text-sm font-medium hover:text-teal-700">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {influencers.map((influencer) => (
          <InfluencerCard key={influencer.handle} {...influencer} />
        ))}
      </div>
    </div>
  );
};

const InfluencerCard = ({ 
  name, 
  handle, 
  avatar, 
  category, 
  engagement, 
  followers, 
  matchScore 
}: {
  name: string;
  handle: string;
  avatar: string;
  category: string;
  engagement: string;
  followers: string;
  matchScore: number;
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />
          <div>
            <h3 className="font-medium text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{handle}</p>
          </div>
        </div>
        <div className="flex items-center bg-teal-50 px-2 py-1 rounded">
          <Star className="w-4 h-4 text-teal-600 mr-1" />
          <span className="text-sm font-medium text-teal-600">{matchScore}%</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm text-gray-600">{category}</div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <div className="text-sm">
              <span className="text-gray-500">Engagement</span>
              <p className="font-medium text-gray-900">{engagement}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <div className="text-sm">
              <span className="text-gray-500">Followers</span>
              <p className="font-medium text-gray-900">{followers}</p>
            </div>
          </div>
        </div>

        <button className="w-full py-2 px-4 border border-teal-600 text-teal-600 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default InfluencerSuggestions;