import React from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Share2 } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Total Reach"
          value="4.2M"
          change="+12.3%"
          icon={<Users className="text-blue-500" size={24} />}
        />
        <MetricCard
          title="Engagement Rate"
          value="5.8%"
          change="+1.2%"
          icon={<Share2 className="text-emerald-500" size={24} />}
        />
        <MetricCard
          title="Conversion Rate"
          value="2.4%"
          change="+0.5%"
          icon={<TrendingUp className="text-purple-500" size={24} />}
        />
        <MetricCard
          title="ROI"
          value="386%"
          change="+8.1%"
          icon={<DollarSign className="text-teal-500" size={24} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Performance by Platform</h2>
            <select className="text-sm border rounded-lg px-3 py-2">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="space-y-4">
            <PlatformMetrics
              platform="Instagram"
              reach="2.1M"
              engagement="4.8%"
              conversions="1.2%"
            />
            <PlatformMetrics
              platform="TikTok"
              reach="1.5M"
              engagement="6.2%"
              conversions="0.8%"
            />
            <PlatformMetrics
              platform="YouTube"
              reach="600K"
              engagement="5.1%"
              conversions="0.4%"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Top Performing Content</h2>
          <div className="space-y-4">
            {[
              {
                title: "Summer Collection Showcase",
                type: "Video",
                engagement: "125K",
                views: "1.2M",
                thumbnail: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b"
              },
              {
                title: "Behind the Scenes",
                type: "Story",
                engagement: "98K",
                views: "800K",
                thumbnail: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93"
              },
              {
                title: "Product Review",
                type: "Reel",
                engagement: "85K",
                views: "750K",
                thumbnail: "https://images.unsplash.com/photo-1511556820780-d912e42b4980"
              }
            ].map((content) => (
              <ContentCard key={content.title} {...content} />
            ))}
          </div>
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
    <div className="bg-white rounded-xl shadow-sm p-6">
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

const PlatformMetrics = ({ 
  platform, 
  reach, 
  engagement, 
  conversions 
}: {
  platform: string;
  reach: string;
  engagement: string;
  conversions: string;
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-4">
        <BarChart3 className="text-gray-400" size={24} />
        <div>
          <h3 className="font-medium text-gray-900">{platform}</h3>
          <p className="text-sm text-gray-500">Reach: {reach}</p>
        </div>
      </div>
      <div className="flex space-x-6">
        <div className="text-right">
          <p className="text-sm text-gray-500">Engagement</p>
          <p className="font-medium text-gray-900">{engagement}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Conversions</p>
          <p className="font-medium text-gray-900">{conversions}</p>
        </div>
      </div>
    </div>
  );
};

const ContentCard = ({ 
  title, 
  type, 
  engagement, 
  views, 
  thumbnail 
}: {
  title: string;
  type: string;
  engagement: string;
  views: string;
  thumbnail: string;
}) => {
  return (
    <div className="flex space-x-4">
      <img
        src={`${thumbnail}?auto=format&fit=crop&w=100&h=100&q=80`}
        alt={title}
        className="w-24 h-24 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">{type}</p>
        <div className="flex space-x-4 text-sm">
          <span className="text-gray-500">Views: {views}</span>
          <span className="text-gray-500">Engagement: {engagement}</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;