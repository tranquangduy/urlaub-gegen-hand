import React from 'react';
import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {/* Add top padding to account for fixed navbar */}
      <main className="pt-16 pb-8 px-4 container mx-auto">{children}</main>
    </>
  );
}
