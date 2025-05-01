'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { Conversation, Message } from '@/types';
import {
  getConversations as storageGetConversations,
  saveConversation as storageSaveConversation,
  getMessages as storageGetMessages,
  saveMessage as storageSaveMessage,
} from '@/lib/messageStorage';

// State and action types
interface MessagingState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
}

type MessagingAction =
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'ADD_CONVERSATION'; payload: Conversation }
  | { type: 'SET_MESSAGES'; conversationId: string; payload: Message[] }
  | { type: 'ADD_MESSAGE'; conversationId: string; payload: Message };

// Context interface
interface MessagingContextType extends MessagingState {
  loadConversations: () => void;
  createConversation: (conversation: Conversation) => void;
  loadMessages: (conversationId: string) => void;
  sendMessage: (conversationId: string, message: Message) => void;
}

// Default state
const defaultState: MessagingState = {
  conversations: [],
  messages: {},
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
    default:
      return state;
  }
}

// Create context
const MessagingContext = createContext<MessagingContextType>({
  ...defaultState,
  loadConversations: () => {},
  createConversation: () => {},
  loadMessages: () => {},
  sendMessage: () => {},
});

// Provider
export const MessagingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(messagingReducer, defaultState);

  const loadConversations = () => {
    const convos = storageGetConversations();
    dispatch({ type: 'SET_CONVERSATIONS', payload: convos });
  };

  const createConversation = (conversation: Conversation) => {
    storageSaveConversation(conversation);
    dispatch({ type: 'ADD_CONVERSATION', payload: conversation });
  };

  const loadMessages = (conversationId: string) => {
    const msgs = storageGetMessages(conversationId);
    dispatch({ type: 'SET_MESSAGES', conversationId, payload: msgs });
  };

  const sendMessage = (conversationId: string, message: Message) => {
    storageSaveMessage(conversationId, message);
    dispatch({ type: 'ADD_MESSAGE', conversationId, payload: message });
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <MessagingContext.Provider
      value={{
        ...state,
        loadConversations,
        createConversation,
        loadMessages,
        sendMessage,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
};

// Hook
export const useMessaging = () => useContext(MessagingContext);
