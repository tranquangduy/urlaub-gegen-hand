'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
  useState,
  useCallback,
} from 'react';
import { Conversation, Message } from '@/types';
import {
  getConversations as storageGetConversations,
  saveConversation as storageSaveConversation,
  getMessages as storageGetMessages,
  saveMessage as storageSaveMessage,
} from '@/lib/messageStorage';
import { useAuth } from './AuthContext';

// State and action types
interface MessagingState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  unreadCounts: Record<string, number>;
  isLoading: boolean;
}

type MessagingAction =
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'ADD_CONVERSATION'; payload: Conversation }
  | { type: 'UPDATE_CONVERSATION'; payload: Conversation }
  | { type: 'SET_MESSAGES'; conversationId: string; payload: Message[] }
  | { type: 'ADD_MESSAGE'; conversationId: string; payload: Message }
  | { type: 'MARK_AS_READ'; conversationId: string; messageIds: string[] }
  | { type: 'SET_UNREAD_COUNTS'; payload: Record<string, number> }
  | { type: 'SET_LOADING'; payload: boolean };

// Context interface
interface MessagingContextType extends MessagingState {
  loadConversations: () => void;
  createConversation: (conversation: Conversation) => Promise<Conversation>;
  loadMessages: (conversationId: string) => void;
  sendMessage: (conversationId: string, message: Message) => Promise<void>;
  markMessagesAsRead: (conversationId: string, messageIds: string[]) => void;
  searchConversations: (query: string) => Conversation[];
  searchMessages: (
    query: string
  ) => { conversationId: string; messages: Message[] }[];
  getTotalUnreadCount: () => number;
  getConversationsByListing: (listingId: string) => Conversation[];
}

// Default state
const defaultState: MessagingState = {
  conversations: [],
  messages: {},
  unreadCounts: {},
  isLoading: false,
};

// Reducer
function messagingReducer(
  state: MessagingState,
  action: MessagingAction
): MessagingState {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    case 'ADD_CONVERSATION':
      return {
        ...state,
        conversations: [...state.conversations, action.payload],
      };
    case 'UPDATE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.conversationId]: action.payload,
        },
      };
    case 'ADD_MESSAGE': {
      const prev = state.messages[action.conversationId] || [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.conversationId]: [...prev, action.payload],
        },
      };
    }
    case 'MARK_AS_READ': {
      const conversationMessages = state.messages[action.conversationId] || [];
      const updatedMessages = conversationMessages.map((msg) =>
        action.messageIds.includes(msg.id) && !msg.readAt
          ? { ...msg, readAt: new Date() }
          : msg
      );

      return {
        ...state,
        messages: {
          ...state.messages,
          [action.conversationId]: updatedMessages,
        },
        unreadCounts: {
          ...state.unreadCounts,
          [action.conversationId]:
            (state.unreadCounts[action.conversationId] || 0) -
            action.messageIds.filter((id) =>
              conversationMessages.some((msg) => msg.id === id && !msg.readAt)
            ).length,
        },
      };
    }
    case 'SET_UNREAD_COUNTS':
      return {
        ...state,
        unreadCounts: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

// Create context
const MessagingContext = createContext<MessagingContextType>({
  ...defaultState,
  loadConversations: () => {},
  createConversation: async () => ({
    id: '',
    participantIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  loadMessages: () => {},
  sendMessage: async () => {},
  markMessagesAsRead: () => {},
  searchConversations: () => [],
  searchMessages: () => [],
  getTotalUnreadCount: () => 0,
  getConversationsByListing: () => [],
});

// Provider
export const MessagingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(messagingReducer, defaultState);
  const { user } = useAuth();
  const [notificationSound] = useState<HTMLAudioElement | null>(
    typeof Audio !== 'undefined' ? new Audio('/sounds/message.mp3') : null
  );

  const loadConversations = useCallback(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const convos = storageGetConversations();
    dispatch({ type: 'SET_CONVERSATIONS', payload: convos });

    // Calculate unread counts
    const unreadCounts: Record<string, number> = {};

    convos.forEach((conv) => {
      const msgs = storageGetMessages(conv.id);
      if (user) {
        unreadCounts[conv.id] = msgs.filter(
          (m) => m.receiverId === user.id && !m.readAt
        ).length;
      }
    });

    dispatch({ type: 'SET_UNREAD_COUNTS', payload: unreadCounts });
    dispatch({ type: 'SET_LOADING', payload: false });
  }, [user]);

  const createConversation = async (
    conversation: Conversation
  ): Promise<Conversation> => {
    // Ensure we have createdAt and updatedAt
    const newConversation = {
      ...conversation,
      createdAt: conversation.createdAt || new Date(),
      updatedAt: conversation.updatedAt || new Date(),
    };

    storageSaveConversation(newConversation);
    dispatch({ type: 'ADD_CONVERSATION', payload: newConversation });
    return newConversation;
  };

  const loadMessages = useCallback(
    (conversationId: string) => {
      const msgs = storageGetMessages(conversationId);
      dispatch({ type: 'SET_MESSAGES', conversationId, payload: msgs });

      // Mark messages as read when loading them (if they're for the current user)
      if (user) {
        const unreadMessageIds = msgs
          .filter((m) => m.receiverId === user.id && !m.readAt)
          .map((m) => m.id);

        if (unreadMessageIds.length > 0) {
          markMessagesAsRead(conversationId, unreadMessageIds);
        }
      }
    },
    [user]
  );

  const sendMessage = async (
    conversationId: string,
    message: Message
  ): Promise<void> => {
    // Ensure we have a createdAt date
    const newMessage = {
      ...message,
      createdAt: message.createdAt || new Date(),
    };

    storageSaveMessage(conversationId, newMessage);
    dispatch({ type: 'ADD_MESSAGE', conversationId, payload: newMessage });

    // Update conversation's updatedAt timestamp
    const conversation = state.conversations.find(
      (c) => c.id === conversationId
    );
    if (conversation) {
      const updatedConversation = {
        ...conversation,
        updatedAt: new Date(),
        lastMessageId: newMessage.id,
      };
      storageSaveConversation(updatedConversation);
      dispatch({ type: 'UPDATE_CONVERSATION', payload: updatedConversation });
    }
  };

  const markMessagesAsRead = useCallback(
    (conversationId: string, messageIds: string[]) => {
      if (messageIds.length === 0) return;

      // Update messages in storage
      const allMessages = storageGetMessages(conversationId);
      const updatedMessages = allMessages.map((msg) =>
        messageIds.includes(msg.id) && !msg.readAt
          ? { ...msg, readAt: new Date() }
          : msg
      );

      // Save back to storage (replacing the entire array)
      localStorage.setItem(
        `messages:${conversationId}`,
        JSON.stringify(updatedMessages)
      );

      // Update state
      dispatch({ type: 'MARK_AS_READ', conversationId, messageIds });
    },
    []
  );

  const searchConversations = useCallback(
    (query: string): Conversation[] => {
      if (!query.trim()) return state.conversations;

      const lowerQuery = query.toLowerCase();
      return state.conversations.filter((conv) => {
        // Search in participant IDs (in a real app, you'd search by participant names)
        const participantMatch = conv.participantIds.some((id) =>
          id.toLowerCase().includes(lowerQuery)
        );

        // Search in messages
        const messages = state.messages[conv.id] || [];
        const messageMatch = messages.some((msg) =>
          msg.content.toLowerCase().includes(lowerQuery)
        );

        return participantMatch || messageMatch;
      });
    },
    [state.conversations, state.messages]
  );

  const searchMessages = useCallback(
    (query: string) => {
      if (!query.trim()) return [];

      const lowerQuery = query.toLowerCase();
      const results: { conversationId: string; messages: Message[] }[] = [];

      Object.entries(state.messages).forEach(([conversationId, messages]) => {
        const matchingMessages = messages.filter((msg) =>
          msg.content.toLowerCase().includes(lowerQuery)
        );

        if (matchingMessages.length > 0) {
          results.push({
            conversationId,
            messages: matchingMessages,
          });
        }
      });

      return results;
    },
    [state.messages]
  );

  const getTotalUnreadCount = useCallback((): number => {
    return Object.values(state.unreadCounts).reduce(
      (sum, count) => sum + count,
      0
    );
  }, [state.unreadCounts]);

  const getConversationsByListing = useCallback(
    (listingId: string): Conversation[] => {
      // In a real app, you'd have a direct relationship between conversations and listings
      // For this MVP, we'll simulate by checking if any message mentions the listing ID
      return state.conversations.filter((conv) => {
        const messages = state.messages[conv.id] || [];
        return messages.some(
          (msg) =>
            msg.content.includes(listingId) ||
            // Check if the message has a bookingId that relates to the listing
            (msg.bookingId && msg.bookingId.includes(listingId))
        );
      });
    },
    [state.conversations, state.messages]
  );

  // Check for new messages periodically (simulating real-time updates)
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (user) {
        const convos = storageGetConversations();

        // Check for new messages
        convos.forEach((conv) => {
          const storedMessages = storageGetMessages(conv.id);
          const currentMessages = state.messages[conv.id] || [];

          // If we have more messages in storage than in state, we have new messages
          if (storedMessages.length > currentMessages.length) {
            const newMessages = storedMessages.filter(
              (stored) =>
                !currentMessages.some((current) => current.id === stored.id)
            );

            // If any new messages are for the current user, play notification sound
            if (newMessages.some((msg) => msg.receiverId === user.id)) {
              notificationSound
                ?.play()
                .catch((err) => console.log('Audio play error:', err));
            }

            // Update state with new messages
            dispatch({
              type: 'SET_MESSAGES',
              conversationId: conv.id,
              payload: storedMessages,
            });

            // Update unread counts
            const unreadCount = storedMessages.filter(
              (m) => m.receiverId === user.id && !m.readAt
            ).length;

            dispatch({
              type: 'SET_UNREAD_COUNTS',
              payload: {
                ...state.unreadCounts,
                [conv.id]: unreadCount,
              },
            });
          }
        });
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(checkInterval);
  }, [notificationSound, state.messages, state.unreadCounts, user]);

  // Load conversations on mount and when user changes
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [loadConversations, user]);

  return (
    <MessagingContext.Provider
      value={{
        ...state,
        loadConversations,
        createConversation,
        loadMessages,
        sendMessage,
        markMessagesAsRead,
        searchConversations,
        searchMessages,
        getTotalUnreadCount,
        getConversationsByListing,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

// Hook
export const useMessaging = () => useContext(MessagingContext);
