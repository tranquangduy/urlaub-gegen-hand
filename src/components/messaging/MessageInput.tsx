'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { useMessaging } from '@/contexts/MessagingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, Smile } from 'lucide-react';
import { TemplateSelector } from './TemplateSelector';

interface MessageInputProps {
  conversationId: string;
}

export default function MessageInput({ conversationId }: MessageInputProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const { conversations, sendMessage } = useMessaging();

  const conv = conversations.find((c) => c.id === conversationId);
  const receiverId = conv?.participantIds.find((id) => id !== user?.id) || '';

  const handleSend = async () => {
    if (!text.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const msg = {
        id: crypto.randomUUID(),
        conversationId,
        senderId: user.id,
        receiverId,
        content: text.trim(),
        createdAt: new Date(),
        readAt: undefined,
      } as Message;

      await sendMessage(conversationId, msg);
      setText('');

      // Focus back on textarea after sending
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Ctrl+Enter or Command+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTemplateSelect = (templateContent: string) => {
    setText(templateContent);
    // Focus and place cursor at end of text
    if (textareaRef.current) {
      textareaRef.current.focus();
      const length = templateContent.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  };

  return (
    <div className="border-t p-3 bg-background">
      <div className="flex items-center gap-2 mb-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          title="Attach file (coming soon)"
          disabled
        >
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          title="Add emoji (coming soon)"
          disabled
        >
          <Smile className="h-4 w-4" />
        </Button>
        <div className="ml-auto">
          <TemplateSelector onSelectTemplate={handleTemplateSelect} />
        </div>
      </div>

      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          className="flex-1 resize-none min-h-[80px] max-h-[200px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Ctrl+Enter to send)"
          rows={3}
        />
        <Button
          className="h-10 w-10 rounded-full p-0 flex-shrink-0"
          onClick={handleSend}
          disabled={!text.trim() || isSubmitting}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-xs text-muted-foreground mt-1 text-right">
        Press Ctrl+Enter to send
      </div>
    </div>
  );
}
