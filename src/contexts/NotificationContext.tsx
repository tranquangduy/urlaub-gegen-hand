'use client';
import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { mockNotifications } from '@/mocks/notifications';

// Define notification types
export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

// Notification interface
type Notification = {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
};

// State and actions
type State = { notifications: Notification[] };
type Action =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: { id: string } }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'REMOVE_NOTIFICATION'; payload: { id: string } };

const initialState: State = { notifications: mockNotifications };

function notificationReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return { notifications: [action.payload, ...state.notifications] };
    case 'MARK_AS_READ':
      return {
        notifications: state.notifications.map((n) =>
          n.id === action.payload.id ? { ...n, read: true } : n
        ),
      };
    case 'MARK_ALL_AS_READ':
      return {
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };
    case 'REMOVE_NOTIFICATION':
      return {
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload.id
        ),
      };
    default:
      return state;
  }
}

// Context interface
interface NotificationContextProps {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  removeNotification: () => {},
});

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const addNotification = (notification: Notification) =>
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  const markAsRead = (id: string) =>
    dispatch({ type: 'MARK_AS_READ', payload: { id } });
  const markAllAsRead = () => dispatch({ type: 'MARK_ALL_AS_READ' });
  const removeNotification = (id: string) =>
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: { id } });

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications(): NotificationContextProps {
  return useContext(NotificationContext);
}
