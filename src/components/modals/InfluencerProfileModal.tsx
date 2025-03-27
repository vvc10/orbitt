import React from 'react';
import { X, Instagram, Twitter, Youtube, Star, TrendingUp, Users, DollarSign } from 'lucide-react';

interface InfluencerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  influencer: {
    name: string;
    handle: string;
    avatar: string;
    category: string;
    engagement: string;
    followers: string;
    matchScore: number;
    bio?: string;
    location?: string;
    rate?: string;
    platforms?: {
      instagram?: string;
      twitter?: string;
      youtube?: string;
    };
    stats?: {
      totalReach: string;
      avgLikes: string;
      avgComments: string;
    };
    previousWork?: Array<{
      title: string;
      brand: string;
      date: string;
      engagement: string;
      image: string;
    }>;
  };
}

const InfluencerProfileModal: React.FC<InfluencerProfileModalProps> = ({ isOpen, onClose, influencer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Influencer Profile</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start space-x-6 mb-8">
            <img
              src={influencer.avatar}
              alt={influencer.name}
              className="w-24 h-24 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{influencer.name}</h3>
                  <p className="text-gray-500">{influencer.handle}</p>
                </div>
                <div className="flex items-center bg-teal-50 px-3 py-1 rounded-full">
                  <Star className="w-5 h-5 text-teal-600 mr-1" />
                  <span className="font-medium text-teal-600">{influencer.matchScore}% Match</span>
                </div>
              </div>
              <p className="mt-2 text-gray-600">{influencer.bio || 'Professional content creator specializing in lifestyle and fashion content.'}</p>
              <div className="mt-4 flex items-center space-x-4">
                {influencer.platforms?.instagram && (
                  <a href={influencer.platforms.instagram} className="text-gray-400 hover:text-gray-500">
                    <Instagram size={24} />
                  </a>
                )}
                {influencer.platforms?.twitter && (
                  <a href={influencer.platforms.twitter} className="text-gray-400 hover:text-gray-500">
                    <Twitter size={24} />
                  </a>
                )}
                {influencer.platforms?.youtube && (
                  <a href={influencer.platforms.youtube} className="text-gray-400 hover:text-gray-500">
                    <Youtube size={24} />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <Users size={20} />
                <span>Followers</span>
              </div>
              <p className="text-xl font-semibold">{influencer.followers}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <TrendingUp size={20} />
                <span>Engagement</span>
              </div>
              <p className="text-xl font-semibold">{influencer.engagement}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <DollarSign size={20} />
                <span>Rate</span>
              </div>
              <p className="text-xl font-semibold">{influencer.rate || '$500-1000'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 text-gray-500 mb-1">
                <Star size={20} />
                <span>Category</span>
              </div>
              <p className="text-xl font-semibold">{influencer.category}</p>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Previous Work</h3>
            <div className="grid grid-cols-3 gap-4">
              {(influencer.previousWork || [
                {
                  title: 'Summer Collection',
                  brand: 'Fashion Brand',
                  date: '2024-02',
                  engagement: '4.8%',
                  image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b'
                },
                {
                  title: 'Product Launch',
                  brand: 'Tech Company',
                  date: '2024-01',
                  engagement: '5.2%',
                  image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93'
                },
                {
                  title: 'Holiday Campaign',
                  brand: 'Lifestyle Brand',
                  date: '2023-12',
                  engagement: '4.5%',
                  image: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980'
                }
              ]).map((work, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <img
                    src={`${work.image}?auto=format&fit=crop&w=300&h=200&q=80`}
                    alt={work.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900">{work.title}</h4>
                    <p className="text-sm text-gray-500">{work.brand}</p>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-gray-500">{work.date}</span>
                      <span className="text-teal-600">{work.engagement} Engagement</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Invite to Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerProfileModal;