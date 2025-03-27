import React, { useState, useEffect } from 'react';
import { X, Save, User, School, GraduationCap, Calendar, FileText } from 'lucide-react';
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserProfile {
  name: string;
  college: string;
  major: string;
  graduationYear: string;
  bio: string;
}

export default function UserSettingsModal({ isOpen, onClose }: UserSettingsModalProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    college: '',
    major: '',
    graduationYear: '',
    bio: ''
  });
  const [isSaving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!auth.currentUser) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load profile data');
      }
    };

    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        ...profile,
        updatedAt: new Date()
      });

      // Update display name in Firebase Auth
      await auth.currentUser.updateProfile({
        displayName: profile.name
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#2e2e2e] rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/20 text-green-300 rounded-lg text-sm">
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 bg-[#1e1e1e] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
              <School className="w-4 h-4" />
              College/University
            </label>
            <input
              type="text"
              value={profile.college}
              onChange={(e) => setProfile(prev => ({ ...prev, college: e.target.value }))}
              className="w-full px-4 py-2 bg-[#1e1e1e] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your college name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Major
            </label>
            <input
              type="text"
              value={profile.major}
              onChange={(e) => setProfile(prev => ({ ...prev, major: e.target.value }))}
              className="w-full px-4 py-2 bg-[#1e1e1e] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your major"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Graduation Year
            </label>
            <input
              type="number"
              value={profile.graduationYear}
              onChange={(e) => setProfile(prev => ({ ...prev, graduationYear: e.target.value }))}
              className="w-full px-4 py-2 bg-[#1e1e1e] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Expected graduation year"
              min={new Date().getFullYear()}
              max={new Date().getFullYear() + 6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Bio (Optional)
            </label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full px-4 py-2 bg-[#1e1e1e] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none h-24"
              placeholder="Tell us about yourself..."
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="animate-spin">⌛</span>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}