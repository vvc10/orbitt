import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, X, Smile, CornerUpLeft, Users, Mic, Bell } from 'lucide-react';
import Picker from '@emoji-mart/react';
import {
  collection, doc, setDoc, updateDoc, query,
  where, onSnapshot, serverTimestamp, orderBy,
  arrayUnion, arrayRemove, getDoc
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../../firebase';
import UserProfileModal from '../modals/UserProfileModal';

interface Message {
  id: string;
  serverId: string;
  channelId: string;
  senderId: string;
  senderName: string;
  avatar: string;
  content: string;
  timestamp: Date;
  attachments?: { type: 'image' | 'file'; url: string; name: string }[];
  reactions?: { [emoji: string]: string[] };
  parentMessageId?: string;
  replies: string[];
}

interface ChatProps {
  serverId: string;
  channelId: string;
  channelType: 'text' | 'voice' | 'announcement';
}

const commonEmojis = ['👍', '❤️', '😂', '🎉', '🤔', '👀'];

export default function Chat({ serverId, channelId, channelType }: ChatProps) {
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [error, setError] = useState('');
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!serverId || !channelId) return;

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('serverId', '==', serverId),
      where('channelId', '==', channelId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const messagesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate(),
          replies: doc.data().replies || [],
          reactions: doc.data().reactions || {},
        })) as Message[];
        setMessages(messagesData);
      },
      (error) => {
        console.error("Error getting messages:", error);
        setError('Failed to load messages. Please refresh the page.');
        setTimeout(() => setError(''), 5000);
      }
    );

    return () => unsubscribe();
  }, [serverId, channelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkServerMembership = async (userId: string) => {
    const serverRef = doc(db, 'servers', serverId);
    const serverDoc = await getDoc(serverRef);
    return serverDoc.exists() && serverDoc.data()?.members.includes(userId);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;
    if (!auth.currentUser) return;
    setError('');

    try {
      const user = auth.currentUser;
      const isMember = await checkServerMembership(user.uid);
      if (!isMember) {
        throw new Error("You must be a server member to send messages");
      }

      const messagesRef = collection(db, 'messages');
      const messageRef = doc(messagesRef);

      let attachments = [];
      if (selectedFile) {
        const storagePath = `attachments/${serverId}/${channelId}/${messageRef.id}/${selectedFile.name}`;
        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);

        const downloadURL = await new Promise<string>((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => reject(error),
            () => getDownloadURL(uploadTask.snapshot.ref).then(resolve)
          );
        });

        attachments.push({
          type: selectedFile.type.startsWith('image') ? 'image' : 'file',
          url: downloadURL,
          name: selectedFile.name
        });
      }

      const newMessage = {
        id: messageRef.id,
        serverId,
        channelId,
        content: message,
        senderId: user.uid,
        senderName: user.displayName || 'Anonymous',
        avatar: user.photoURL || '',
        timestamp: serverTimestamp(),
        reactions: {},
        attachments,
        replies: [],
        parentMessageId: replyingTo?.id || null
      };

      await setDoc(messageRef, newMessage);

      if (replyingTo) {
        const parentRef = doc(db, 'messages', replyingTo.id);
        await updateDoc(parentRef, {
          replies: arrayUnion(messageRef.id)
        });
      }

      setMessage('');
      setSelectedFile(null);
      setImagePreview(null);
      setUploadProgress(0);
      setReplyingTo(null);

    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message. Please try again.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    if (!auth.currentUser?.uid) return;

    try {
      const isMember = await checkServerMembership(auth.currentUser.uid);
      if (!isMember) {
        throw new Error("You must be a server member to react");
      }

      const messageRef = doc(db, 'messages', messageId);
      const message = messages.find(m => m.id === messageId);
      const hasReacted = message?.reactions?.[emoji]?.includes(auth.currentUser.uid);

      if (hasReacted) {
        await updateDoc(messageRef, {
          [`reactions.${emoji}`]: arrayRemove(auth.currentUser.uid)
        });
      } else {
        await updateDoc(messageRef, {
          [`reactions.${emoji}`]: arrayUnion(auth.currentUser.uid)
        });
      }
      setShowReactionPicker(null);
    } catch (error: any) {
      console.error('Error updating reaction:', error);
      setError(error.message || 'Failed to add reaction');
      setTimeout(() => setError(''), 3000);
    }
  };


  const handleUserClick = (userId: string) => {
    console.log('User clicked:', userId);
    setSelectedUserId(userId);
    setIsProfileModalOpen(true);
  };


  const renderNonTextChannel = () => {
    if (channelType === 'voice') {
      return (
        <div className="flex-1 flex items-center justify-center bg-[#363636]">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#2e2e2e] rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Voice Channel</h3>
            <p className="text-gray-400 mb-4">Join the voice chat to communicate with others</p>
            <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 mx-auto">
              <Users className="w-5 h-5" />
              Join Voice Chat
            </button>
          </div>
        </div>
      );
    }

    if (channelType === 'announcement') {
      return (
        <div className="flex-1 flex items-center justify-center bg-[#363636]">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#2e2e2e] rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Announcement Channel</h3>
            <p className="text-gray-400">Only administrators can post announcements here</p>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderMessage = (msg: Message, depth: number = 0) => (
    <div
      key={msg.id}
      className={`group mb-4 p-2 hover:bg-[#2e2e2e] rounded-lg transition-colors duration-200
        ${depth > 0 ? 'ml-6 border-l-2 border-gray-700 pl-4' : ''}`}
      style={{ marginLeft: `${depth * 1.5}rem` }}
    >
      {msg.parentMessageId && (
        <div className="text-sm text-gray-400 mb-2 flex items-center gap-1">
          <CornerUpLeft className="w-4 h-4" />
          <span className="truncate">
            Replying to {messages.find(m => m.id === msg.parentMessageId)?.senderName}
          </span>
        </div>
      )}
      <div className="flex items-start gap-3">
        <img
          src={msg.avatar || `https://ui-avatars.com/api/?name=${msg.senderName}`}
          alt={msg.senderName}
          className="w-10 h-10 rounded-full flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleUserClick(msg.senderId)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="font-medium text-white truncate cursor-pointer hover:text-teal-400 transition-colors"
              onClick={() => handleUserClick(msg.senderId)}
            >
              {msg.senderName}
            </span>
            <span className="text-xs text-gray-400 flex-shrink-0">
              {msg.timestamp?.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <p className="mt-1 text-gray-200 break-words">{msg.content}</p>

          {msg.attachments?.map((attachment, index) => (
            <div key={index} className="mt-2">
              {attachment.type === 'image' ? (
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="max-w-md rounded-lg max-h-64 object-cover"
                />
              ) : (
                <a
                  href={attachment.url}
                  className="text-teal-400 hover:text-teal-300 flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📎 {attachment.name}
                </a>
              )}
            </div>
          ))}

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {Object.entries(msg.reactions || {}).map(([emoji, users]) => (
              <button
                key={emoji}
                onClick={() => handleReaction(msg.id, emoji)}
                className={`flex items-center px-2 py-1 rounded-full text-sm transition-all duration-150
                  ${users.includes(auth.currentUser?.uid || '')
                    ? 'bg-teal-500/20 text-teal-300'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                  }`}
              >
                <span className="mr-1">{emoji}</span>
                <span className="text-xs">{users.length}</span>
              </button>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setReplyingTo(msg)}
              className="text-gray-400 hover:text-white p-1.5 rounded-md bg-gray-700/50 hover:bg-gray-600"
            >
              <CornerUpLeft className="w-4 h-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id)}
                className="text-gray-400 hover:text-white p-1.5 rounded-md bg-gray-700/50 hover:bg-gray-600"
              >
                <Smile className="w-4 h-4" />
              </button>
              {showReactionPicker === msg.id && (
                <div className="absolute bottom-full left-0 mb-2 p-2 bg-[#2e2e2e] rounded-lg shadow-lg flex gap-1">
                  {commonEmojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => handleReaction(msg.id, emoji)}
                      className="hover:bg-gray-700 p-1.5 rounded-md transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {msg.replies.length > 0 && (
            <div className="mt-4 space-y-4">
              {msg.replies.map(replyId => {
                const reply = messages.find(m => m.id === replyId);
                return reply && renderMessage(reply, depth + 1);
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (channelType !== 'text') {
    return renderNonTextChannel();
  }

  return (
    <div className="flex-1 flex flex-col h-[80vh] bg-[#363636]">
      {error && (
        <div className="px-4 py-2 bg-red-500/20 text-red-300 text-sm text-center">
          {error}
        </div>
      )}

      {replyingTo && (
        <div className="px-4 py-2 bg-[#2e2e2e] border-b border-[#1a1a1a] flex items-center justify-between">
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <CornerUpLeft className="w-4 h-4" />
            Replying to <span className="text-white">{replyingTo.senderName}</span>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.filter(m => !m.parentMessageId).map(msg => renderMessage(msg))}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-4 border-t border-[#2e2e2e]">
        {uploadProgress > 0 && (
          <div className="mb-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {imagePreview && (
          <div className="mb-4 relative inline-block">
            <img src={imagePreview} alt="Preview" className="max-h-32 rounded-lg" />
            <button
              onClick={() => {
                setSelectedFile(null);
                setImagePreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <form ref={formRef} onSubmit={sendMessage} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${channelType === 'text' ? '#general' : ''}`}
              className="w-full px-4 py-2 bg-[#2e2e2e] rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-gray-400 hover:text-gray-200 p-1.5 rounded-md hover:bg-gray-600"
              >
                <Smile className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-gray-200 p-1.5 rounded-md hover:bg-gray-600"
              >
                <Image className="w-5 h-5" />
              </button>
            </div>

            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2">
                <Picker
                  data={async () => {
                    const response = await fetch(
                      'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
                    );
                    return response.json();
                  }}
                  onEmojiSelect={(emoji: any) => {
                    setMessage(prev => prev + emoji.native);
                    setShowEmojiPicker(false);
                  }}
                  theme="dark"
                  onClickOutside={() => setShowEmojiPicker(false)}
                />
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 10 * 1024 * 1024) {
                  setError('File size must be less than 10MB');
                  setTimeout(() => setError(''), 3000);
                  return;
                }
                setSelectedFile(file);
                if (file.type.startsWith('image')) {
                  const reader = new FileReader();
                  reader.onloadend = () => setImagePreview(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }
            }}
            className="hidden"
            accept="image/*, .pdf, .doc, .docx, .txt"
          />

          <button
            type="submit"
            className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
            disabled={!message.trim() && !selectedFile}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userId={selectedUserId}
      />
 
    </div>
  );
}