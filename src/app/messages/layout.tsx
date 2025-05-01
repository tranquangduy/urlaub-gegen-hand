'use client';

import React from 'react';
import { MessagingProvider } from '@/contexts/MessagingContext';

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MessagingProvider>{children}</MessagingProvider>;
}
