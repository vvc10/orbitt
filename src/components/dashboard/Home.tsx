import React from 'react';
import { Rocket, Star, TrendingUp, Users, BookOpen, Calendar, Bell, MessageSquare, Code, Microscope, Calculator, Music, Palette, Hash } from 'lucide-react';
import { User } from 'firebase/auth';

interface Server {
  id: string;
  name: string;
  iconUrl?: string;
  coverUrl?: string;
  color: string;
  description?: string;
  members: string[];
  membersCount: number;
  owner: string;
  channels: string[];
  unreadCount?: number;
  lastActivity?: string;
}

interface HomeProps {
  joinedServers: Server[];
  onServerClick: (serverId: string) => void;
  user: User | null;
}

export default function Home({ onServerClick, user, joinedServers, gotoExplore }: HomeProps) {
  const recentActivity = [
    { icon: MessageSquare, text: 'New message in Computer Science 101', time: '5m ago' },
    { icon: Users, text: 'Sarah joined your study group', time: '15m ago' },
    { icon: Bell, text: 'Assignment deadline reminder', time: '1h ago' },
    { icon: Star, text: 'Your post was featured', time: '2h ago' }
  ];

  const upcomingEvents = [
    {
      title: 'Tech Workshop',
      date: 'Tomorrow, 2:00 PM',
      attendees: 45,
      server: 'Computer Science 101',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    {
      title: 'Study Group Meeting',
      date: 'Wed, 4:00 PM',
      attendees: 12,
      server: 'Biology Research',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto h-screen overflow-y-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.displayName || 'Student'}!
        </h1>
        <p className="text-gray-400">Here's what's happening in your academic communities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Joined Servers */}
          <div className="bg-[#2e2e2e] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Your Communities</h2>
            </div>
            <div className="grid gap-4">
              {joinedServers.length > 0 ? (
                joinedServers.map((server) => (
                  <button
                    key={server.id}
                    onClick={() => onServerClick(server.id)}
                    className="w-full flex items-center p-4 rounded-lg bg-[#363636] hover:bg-[#404040] transition-colors duration-200 group"
                  >
                    {server.iconUrl ? (
                      <img
                        src={server.iconUrl}
                        alt={server.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className={`w-12 h-12 ${server.color} rounded-lg flex items-center justify-center text-white text-xl font-semibold`}>
                        {server.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="ml-4 flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white group-hover:text-teal-400 transition-colors">
                          {server.name}
                        </h3>
                        {server.unreadCount && server.unreadCount > 0 && (
                          <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
                            {server.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-400">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{server.membersCount} members</span>
                        {server.lastActivity && (
                          <>
                            <span className="mx-2">•</span>
                            <span>Active {server.lastActivity}</span>
                          </>
                        )}
                      </div>
                      {server.description && (
                        <p className="mt-1 text-sm text-gray-400 line-clamp-1">{server.description}</p>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                  <div className="mb-8 text-7xl">🎓</div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Welcome to Campus Connect!
                  </h2>
                  <p className="text-gray-400 mb-8 max-w-md">
                    Join study groups, academic communities, and class channels to start collaborating with your peers!
                  </p>
                  <button
                    onClick={gotoExplore}
                    className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors duration-200"
                  >
                    Explore Communities
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-[#2e2e2e] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Upcoming Events</h2>
              <button className="text-teal-400 hover:text-teal-300 text-sm font-medium transition-colors duration-200">
                View Calendar
              </button>
            </div>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-[#363636] rounded-lg">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white text-lg">{event.title}</h3>
                      <p className="text-gray-400 text-sm">{event.date}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center text-gray-400 text-sm">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{event.attendees} attending</span>
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                          <Hash className="w-4 h-4 mr-1" />
                          <span className="truncate">{event.server}</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors duration-200 whitespace-nowrap">
                      Join Event
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <div className="mb-4 text-4xl">📅</div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No upcoming events
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Events from your communities will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-[#2e2e2e] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Your Activity</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#363636] rounded-lg hover:bg-[#404040] transition-colors duration-200">
                <BookOpen className="w-6 h-6 text-teal-400 mb-2" />
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-sm text-gray-400">Active Courses</div>
              </div>
              <div className="p-4 bg-[#363636] rounded-lg hover:bg-[#404040] transition-colors duration-200">
                <MessageSquare className="w-6 h-6 text-green-400 mb-2" />
                <div className="text-2xl font-bold text-white">48</div>
                <div className="text-sm text-gray-400">Messages</div>
              </div>
              <div className="p-4 bg-[#363636] rounded-lg hover:bg-[#404040] transition-colors duration-200">
                <Calendar className="w-6 h-6 text-purple-400 mb-2" />
                <div className="text-2xl font-bold text-white">5</div>
                <div className="text-sm text-gray-400">Events</div>
              </div>
              <div className="p-4 bg-[#363636] rounded-lg hover:bg-[#404040] transition-colors duration-200">
                <Users className="w-6 h-6 text-yellow-400 mb-2" />
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-sm text-gray-400">Study Groups</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#2e2e2e] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-[#363636] rounded-lg hover:bg-[#404040] transition-colors duration-200">
                  <div className="p-2 bg-[#2e2e2e] rounded-lg">
                    <activity.icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-300 text-sm">{activity.text}</p>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}