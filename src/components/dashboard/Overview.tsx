import React from 'react';
import { Calendar, MessageSquare, Users, BookOpen } from 'lucide-react';

export default function Overview() {
  const stats = [
    {
      icon: Calendar,
      label: 'Upcoming Events',
      value: '3',
      color: 'bg-blue-500',
    },
    {
      icon: MessageSquare,
      label: 'Unread Messages',
      value: '5',
      color: 'bg-green-500',
    },
    {
      icon: Users,
      label: 'Active Groups',
      value: '8',
      color: 'bg-purple-500',
    },
    {
      icon: BookOpen,
      label: 'Resources',
      value: '12',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm p-6">
            <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              'Joined Web Development study group',
              'Submitted assignment for CS101',
              'RSVP\'d to Campus Tech Fair',
              'Downloaded study materials',
            ].map((activity, index) => (
              <div key={index} className="flex items-center text-gray-600 py-2 border-b">
                <div className="w-2 h-2 rounded-full bg-teal-500 mr-3" />
                {activity}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {[
              { title: 'Tech Workshop', date: 'Tomorrow, 2:00 PM' },
              { title: 'Study Group Meeting', date: 'Wed, 4:00 PM' },
              { title: 'Career Fair', date: 'Fri, 10:00 AM' },
              { title: 'Programming Contest', date: 'Next Mon, 1:00 PM' },
            ].map((event, index) => (
              <div key={index} className="flex justify-between items-center text-gray-600 py-2 border-b">
                <span>{event.title}</span>
                <span className="text-sm text-gray-500">{event.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}