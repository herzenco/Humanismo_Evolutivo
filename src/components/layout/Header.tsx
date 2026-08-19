"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X, Search, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { useAdmin } from '@/hooks/useAdmin';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t, language } = useLanguage();
  const router = useRouter();
  const { isAdmin } = useAdmin();

  const trackNavigation = (linkName: string, path: string) => {
    window.dataLayer?.push({
      event: 'navigation_click',
      link_name: linkName,
      link_path: path,
      device_type: window.innerWidth < 768 ? 'mobile' : 'desktop'
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

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

  const navLinks = [
    { name: t('nav.author'), path: '/autor' },
    { name: t('nav.books'), path: '/libros' },
    { name: t('nav.podcast'), path: '/medios' },
    { name: t('nav.events'), path: '/eventos' },
    { name: t('nav.resources'), path: '/resources' },
    { name: t('nav.vision'), path: '/vision' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out',
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b shadow-sm py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="Humanismo Evolutivo - Página de inicio">
          <div className="font-heading text-2xl font-semibold tracking-tight">
            <span className="text-primary">Humanismo</span> <span className="text-gold">Evolutivo</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
          <nav className="flex items-center space-x-4 xl:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="text-foreground/80 hover:text-foreground transition-colors relative group gold-underline"
                onClick={() => trackNavigation(link.name, link.path)}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="text"
              placeholder={language === 'es' ? 'Buscar...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-40 xl:w-64 pl-10 pr-4 py-2 rounded-full bg-background/50 border-muted focus:border-gold transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </form>

          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 text-gold hover:text-gold/80 transition-colors"
              title="Panel de Administración"
            >
              <Shield className="h-5 w-5" />
            </Link>
          )}

          <LanguageToggle />
        </div>

        {/* Mobile menu button and language toggle */}
        <div className="flex items-center space-x-2 lg:hidden">
          <LanguageToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-primary rounded-md"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden bg-background/95 backdrop-blur-md shadow-lg"
        >
          <div className="container mx-auto py-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="px-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder={language === 'es' ? 'Buscar...' : 'Search...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-full"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </form>

            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className="py-2 px-4 text-foreground/80 hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  onClick={() => {
                    trackNavigation(link.name, link.path);
                    setMobileMenuOpen(false);
                  }}
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="py-2 px-4 text-gold hover:text-gold/80 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="h-4 w-4" />
                  {language === 'es' ? 'Administración' : 'Admin'}
                </Link>
              )}
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
