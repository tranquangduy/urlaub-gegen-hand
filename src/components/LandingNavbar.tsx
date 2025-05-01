'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export const LandingNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm shadow-sm py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Urlaub Gegen Hand"
              width={120}
              height={30}
              className="dark:invert"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/search"
              className="text-foreground hover:text-primary transition-colors"
            >
              Find Opportunities
            </Link>
            <Link
              href="#how-it-works"
              className="text-foreground hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#opportunities"
              className="text-foreground hover:text-primary transition-colors"
            >
              Opportunities
            </Link>
            <Link
              href="#testimonials"
              className="text-foreground hover:text-primary transition-colors"
            >
              Success Stories
            </Link>
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Sign Up</Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2">
            <div className="flex flex-col space-y-4">
              <Link
                href="/search"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Find Opportunities
              </Link>
              <Link
                href="#how-it-works"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#opportunities"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Opportunities
              </Link>
              <Link
                href="#testimonials"
                className="text-foreground hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Success Stories
              </Link>
              <div className="flex space-x-4 pt-2">
                <Link href="/login" className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/login" className="flex-1">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
