import React, { useState } from 'react';
import { X, Hash, Users, Bell, Lock } from 'lucide-react';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (data: {
    name: string;
    type: 'text' | 'voice' | 'announcement';
    isPrivate: boolean;
  }) => void;
}

export default function CreateChannelModal({ isOpen, onClose, onCreateChannel }: CreateChannelModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'text' | 'voice' | 'announcement'>('text');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateChannel({ name, type, isPrivate });
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setType('text');
    setIsPrivate(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2e2e2e] rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={resetForm}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Create Channel</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="channelName" className="block text-sm font-medium text-gray-200 mb-2">
              Channel Name
            </label>
            <input
              type="text"
              id="channelName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-[#1e1e1e] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter channel name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Channel Type
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setType('text')}
                className={`flex flex-col items-center p-4 rounded-lg transition-colors
                  ${type === 'text'
                    ? 'bg-teal-600 text-white'
                    : 'bg-[#1e1e1e] text-gray-400 hover:bg-[#363636]'
                  }`}
              >
                <Hash className="w-6 h-6 mb-2" />
                <span className="text-sm">Text</span>
              </button>
              <button
                type="button"
                onClick={() => setType('voice')}
                className={`flex flex-col items-center p-4 rounded-lg transition-colors
                  ${type === 'voice'
                    ? 'bg-teal-600 text-white'
                    : 'bg-[#1e1e1e] text-gray-400 hover:bg-[#363636]'
                  }`}
              >
                <Users className="w-6 h-6 mb-2" />
                <span className="text-sm">Voice</span>
              </button>
              <button
                type="button"
                onClick={() => setType('announcement')}
                className={`flex flex-col items-center p-4 rounded-lg transition-colors
                  ${type === 'announcement'
                    ? 'bg-teal-600 text-white'
                    : 'bg-[#1e1e1e] text-gray-400 hover:bg-[#363636]'
                  }`}
              >
                <Bell className="w-6 h-6 mb-2" />
                <span className="text-sm">Announcement</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
            />
            <label htmlFor="isPrivate" className="text-gray-200 flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              Make channel private
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Create Channel
          </button>
        </form>
      </div>
    </div>
  );
}