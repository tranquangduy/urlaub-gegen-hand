'use client';

import React, { useState } from 'react';
import { useMessaging } from '@/contexts/MessagingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/types';

interface MessageInputProps {
  conversationId: string;
}

export default function MessageInput({ conversationId }: MessageInputProps) {
  const [text, setText] = useState('');
  const { user } = useAuth();
  const { conversations, sendMessage } = useMessaging();

  const conv = conversations.find((c) => c.id === conversationId);
  const receiverId = conv?.participantIds.find((id) => id !== user?.id) || '';

  const handleSend = () => {
    if (!text.trim() || !user) return;
    const msg = {
      id: crypto.randomUUID(),
      conversationId,
      senderId: user.id,
      receiverId,
      content: text.trim(),
      createdAt: new Date(),
      readAt: undefined,
    } as Message;
    sendMessage(conversationId, msg);
    setText('');
  };

  return (
    <div className="flex items-center border-t p-3">
      <textarea
        className="flex-1 resize-none rounded-md border p-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        rows={2}
      />
      <button
        className="ml-2 rounded-md bg-blue-500 px-4 py-2 text-white"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}
