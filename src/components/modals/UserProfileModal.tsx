import React, { useState, useEffect } from 'react';
import { X, Mail, School, GraduationCap, Calendar, FileText, MapPin } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

interface UserProfile {
  name: string;
  email: string;
  college: string;
  major: string;
  graduationYear: string;
  bio: string;
  avatar?: string;
}

export default function UserProfileModal({ isOpen, onClose, userId }: UserProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          setError('User profile not found');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2e2e2e] rounded-lg w-full max-w-md overflow-hidden">
        {/* Header with cover image */}
        <div className="h-32 bg-gradient-to-r from-teal-500 to-purple-600 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/30 p-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4">
            <img
              src={profile?.avatar || `https://ui-avatars.com/api/?name=${profile?.name || 'User'}&background=random`}
              alt={profile?.name}
              className="w-32 h-32 rounded-full border-4 border-[#2e2e2e] bg-[#1e1e1e]"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin text-2xl">⌛</div>
            </div>
          ) : error ? (
            <div className="text-red-400 text-center py-8">{error}</div>
          ) : profile ? (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                <div className="flex items-center gap-2 text-gray-400 mt-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profile.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1e1e1e] p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <School className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">College</span>
                  </div>
                  <p className="text-white text-sm truncate">{profile.college}</p>
                </div>

                <div className="bg-[#1e1e1e] p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase">Major</span>
                  </div>
                  <p className="text-white text-sm truncate">{profile.major}</p>
                </div>
              </div>

              <div className="bg-[#1e1e1e] p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-400 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Class of {profile.graduationYear}</span>
                </div>
                {profile.bio && (
                  <>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm font-medium">Bio</span>
                    </div>
                    <p className="text-gray-300 text-sm">{profile.bio}</p>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}