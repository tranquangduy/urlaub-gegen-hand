'use client';

import React from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
} from '@/components/ui/drawer';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationCenter: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="relative p-2 focus:outline-none">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <h2 className="text-lg font-semibold">Notifications</h2>
          <DrawerClose asChild>
            <button aria-label="Close notifications">×</button>
          </DrawerClose>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          {notifications.length === 0 ? (
            <p className="text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-2 rounded border ${
                  n.read ? 'bg-gray-100' : 'bg-white'
                }`}
              >
                <p
                  className={`text-sm ${
                    n.read ? 'text-gray-500' : 'text-black'
                  }`}
                >
                  {n.message}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(n.timestamp).toLocaleString()}
                </p>
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="mt-2 text-sm text-blue-600"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))
          )}
          {notifications.length > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="mt-2 text-sm text-blue-600"
            >
              Mark all as read
            </button>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default NotificationCenter;
