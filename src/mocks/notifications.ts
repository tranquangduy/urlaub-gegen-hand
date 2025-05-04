import type { NotificationType } from '@/contexts/NotificationContext';

export interface MockNotification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
}

export const mockNotifications: MockNotification[] = [
  {
    id: '1',
    type: 'INFO' as NotificationType,
    message: 'Welcome! Your host dashboard is ready.',
    timestamp: new Date(),
    read: false,
    link: '/dashboard/host/listings',
  },
  {
    id: '2',
    type: 'SUCCESS' as NotificationType,
    message: 'You have a new booking request.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: false,
    link: '/dashboard/host/requests',
  },
  {
    id: '3',
    type: 'WARNING' as NotificationType,
    message: 'Your profile is incomplete.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
    link: '/profile',
  },
  {
    id: '4',
    type: 'ERROR' as NotificationType,
    message: 'Failed to load initial data.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read: false,
  },
];
