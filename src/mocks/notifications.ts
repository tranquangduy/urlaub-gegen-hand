import { NotificationType } from '@/contexts/NotificationContext';

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
    type: NotificationType.INFO,
    message: 'Welcome! Your host dashboard is ready.',
    timestamp: new Date(),
    read: false,
    link: '/dashboard/host/listings',
  },
  {
    id: '2',
    type: NotificationType.SUCCESS,
    message: 'You have a new booking request.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: false,
    link: '/dashboard/host/requests',
  },
  {
    id: '3',
    type: NotificationType.WARNING,
    message: 'Your profile is incomplete.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
    link: '/profile',
  },
];
