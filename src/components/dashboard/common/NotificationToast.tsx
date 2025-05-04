'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/contexts/NotificationContext';

const AUTO_DISMISS_MS = 5000;

const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  useEffect(() => {
    notifications.forEach((notif) => {
      const timer = setTimeout(() => {
        removeNotification(notif.id);
      }, AUTO_DISMISS_MS);
      return () => clearTimeout(timer);
    });
  }, [notifications, removeNotification]);

  return (
    <div className="fixed top-16 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-white shadow-md rounded p-3 max-w-xs"
          >
            <p className="text-sm text-gray-800">{notif.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationToast;
