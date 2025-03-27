import React, { useEffect, useState } from 'react';
import {
  Channel,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
  useChannelStateContext,
  useChatContext
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import { StreamChat } from 'stream-chat';

interface ChatProps {
  serverId: string;
  channelId: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}

const apiKey = 'YOUR_STREAM_API_KEY'; // Get from Stream Dashboard
const client = StreamChat.getInstance(apiKey);

export default function StreamChatComponent({ serverId, channelId, user }: ChatProps) {
  const [channel, setChannel] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setupClient = async () => {
      try {
        await client.connectUser(
          {
            id: user.id,
            name: user.name,
            image: user.image
          },
          client.devToken(user.id) // For development only - use server-side token in production
        );

        const channel = client.channel('team', `${serverId}-${channelId}`, {
          name: `Server ${serverId} - ${channelId}`,
          members: [user.id],
        });
        
        await channel.watch();
        setChannel(channel);
        setIsReady(true);
      } catch (error) {
        console.error('Error setting up chat:', error);
      }
    };

    if (!client.userID) {
      setupClient();
    }

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [serverId, channelId, user]);

  if (!isReady) return <div className="p-4 text-gray-400">Loading chat...</div>;

  return (
    <Chat client={client} theme="str-chat__theme-dark">
      <Channel channel={channel}>
        <Window>
          <MessageList 
            disableDateSeparator
            messageActions={['react', 'reply', 'edit', 'delete']}
          />
          <MessageInput 
            additionalTextareaProps={{
              placeholder: "Type your message...",
            }}
            fileUploads="multiple"
            imageUploads="multiple"
          />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}