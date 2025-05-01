import React from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerClose,
} from '@/components/ui/drawer';
import { Menu } from 'lucide-react';

const navItems = [
  { title: 'Home', href: '/' },
  { title: 'Listings', href: '/listings' },
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Messages', href: '/messages' },
  { title: 'Profile', href: '/profile' },
];

const Navbar: React.FC = () => {
  return (
    <header className="w-full bg-white border-b shadow-sm fixed top-0 z-40">
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        <Link href="/" className="text-xl font-bold">
          UrlaubGegenHand
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink asChild>
                      <Link href={item.href}>{item.title}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        {/* Mobile Navigation Drawer */}
        <div className="md:hidden">
          <Drawer>
            <DrawerTrigger asChild>
              <button aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <h2 className="text-lg font-semibold">Menu</h2>
                <DrawerClose asChild>
                  <button aria-label="Close menu">×</button>
                </DrawerClose>
              </DrawerHeader>
              <div className="flex flex-col p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-base font-medium"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
