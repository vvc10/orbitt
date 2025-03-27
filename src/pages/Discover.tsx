import React, { useState } from 'react';
import { Search, Filter, Star, TrendingUp, Users } from 'lucide-react';
import InfluencerProfileModal from '../components/modals/InfluencerProfileModal';

const Discover = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);

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
    },
    {
      name: 'David Kim',
      handle: '@davidtech',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      category: 'Technology',
      engagement: '4.5%',
      followers: '180K',
      matchScore: 82
    }
  ];

  const filteredInfluencers = influencers.filter(influencer => {
    const matchesCategory = selectedCategory === 'all' || influencer.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.handle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Discover Influencers</h1>
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          Save Search
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Filters</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="all">All Categories</option>
                  <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                  <option value="Food & Travel">Food & Travel</option>
                  <option value="Health & Fitness">Health & Fitness</option>
                  <option value="Technology">Technology</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Followers Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="border rounded-lg px-3 py-2"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Engagement Rate
                </label>
                <select className="w-full border rounded-lg px-3 py-2">
                  <option>Any</option>
                  <option>Above 1%</option>
                  <option>Above 3%</option>
                  <option>Above 5%</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter location"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, handle, or keywords..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
              <button className="flex items-center px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-50">
                <Filter size={20} className="mr-2" />
                Sort
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredInfl uencers.map((influencer) => (
                <InfluencerCard
                  key={influencer.handle}
                  {...influencer}
                  onClick={() => setSelectedInfluencer(influencer)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedInfluencer && (
        <InfluencerProfileModal
          isOpen={!!selectedInfluencer}
          onClose={() => setSelectedInfluencer(null)}
          influencer={selectedInfluencer}
        />
      )}
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
  matchScore,
  onClick
}: {
  name: string;
  handle: string;
  avatar: string;
  category: string;
  engagement: string;
  followers: string;
  matchScore: number;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
    >
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

export default Discover;