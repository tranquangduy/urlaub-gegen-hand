import { Conversation, Message } from '@/types';

const CONVERSATIONS_KEY = 'conversations';
const MESSAGES_KEY_PREFIX = 'messages';

export function getConversations(): Conversation[] {
  const raw = localStorage.getItem(CONVERSATIONS_KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    console.warn('Failed to parse conversations from storage');
    return [];
  }
}

export function saveConversation(conversation: Conversation): void {
  const conversations = getConversations();
  const exists = conversations.find((c) => c.id === conversation.id);
  if (exists) {
    const updated = conversations.map((c) =>
      c.id === conversation.id ? conversation : c
    );
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updated));
  } else {
    conversations.push(conversation);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  }
}

export function getMessages(conversationId: string): Message[] {
  const key = `${MESSAGES_KEY_PREFIX}:${conversationId}`;
  const raw = localStorage.getItem(key);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    console.warn(`Failed to parse messages for conversation ${conversationId}`);
    return [];
  }
}

export function saveMessage(conversationId: string, message: Message): void {
  const key = `${MESSAGES_KEY_PREFIX}:${conversationId}`;
  const messages = getMessages(conversationId);
  messages.push(message);
  localStorage.setItem(key, JSON.stringify(messages));
}
