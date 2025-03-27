import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Upload, Globe, Lock, Loader2, Image as ImageIcon } from 'lucide-react';

interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateServer: (serverData: { 
    name: string; 
    description: string;
    isPublic: boolean;
    channelTypes: string[];
    icon?: File;
    cover?: File;
  }) => void;
}

export default function CreateServerModal({ isOpen, onClose, onCreateServer }: CreateServerModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [selectedChannelTypes, setSelectedChannelTypes] = useState<string[]>([]);

  const channelTypes = [
    'Tech',
    'Academic',
    'Arts & Culture',
    'Science',
    'Sports',
    'Gaming',
    'Music',
    'Education',
    'Announcement',
    'Notes',
    'Chill',
    'Jobs',
    'Hirings',
    'Discussion',
    'Q&A',
    'Projects',
    'Feedback'
  ];

  const handleFileChange = (type: 'icon' | 'cover') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'icon') {
        setIcon(file);
        setIconPreview(reader.result as string);
      } else {
        setCover(file);
        setCoverPreview(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedChannelTypes.length === 0) return;

    setIsLoading(true);
    try {
      await onCreateServer({ 
        name, 
        description,
        isPublic,
        channelTypes: selectedChannelTypes,
        icon: icon || undefined,
        cover: cover || undefined
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChannelType = (type: string) => {
    setSelectedChannelTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-[80vh] overflow-scroll bg-white rounded-lg shadow-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Create New Server</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cover Image
                </label>
                <div className="group relative aspect-video rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange('cover')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-sm">Upload Cover Image</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Icon Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Server Icon
                </label>
                <div className="relative w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange('icon')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {iconPreview ? (
                    <img
                      src={iconPreview}
                      alt="Icon preview"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Upload className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Server Name */}
              <div>
                <label htmlFor="server-name" className="block text-sm font-medium text-gray-700">
                  Server Name
                </label>
                <input
                  type="text"
                  id="server-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  placeholder="e.g., Computer Science 101"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="server-description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="server-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                  placeholder="What's this server about?"
                />
              </div>

              {/* Channel Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel Types (Select multiple)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {channelTypes.map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => toggleChannelType(type)}
                      className={`p-3 rounded-lg border-2 text-sm flex items-center justify-between ${
                        selectedChannelTypes.includes(type)
                          ? 'border-teal-500 bg-teal-50 font-medium'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span>{type}</span>
                      {selectedChannelTypes.includes(type) && (
                        <span className="text-teal-600 ml-2">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Server Visibility
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPublic(true)}
                    className={`p-4 rounded-lg border-2 ${
                      isPublic 
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Globe className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <span className="block text-sm font-medium">Public</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Anyone can find and join
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPublic(false)}
                    className={`p-4 rounded-lg border-2 ${
                      !isPublic 
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Lock className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <span className="block text-sm font-medium">Private</span>
                    <p className="text-xs text-gray-500 mt-1">
                      Only invited members can join
                    </p>
                  </button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !name.trim() || selectedChannelTypes.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Server</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}