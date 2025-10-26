import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, School, BookOpen, BarChart3, User, Settings, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const mainNavItems: NavItem[] = [
    { label: 'Home', href: '/', icon: <Home size={18} /> },
    { label: 'Classroom', href: '/classroom', icon: <School size={18} /> },
    { label: 'Homework', href: '/homework', icon: <BookOpen size={18} /> },
    { label: 'Analytics', href: '/analytics', icon: <BarChart3 size={18} /> },
  ];

  const secondaryNavItems: NavItem[] = [
    { label: 'Profile', href: '/profile', icon: <User size={18} /> },
    { label: 'Settings', href: '/settings', icon: <Settings size={18} /> },
  ];

  const isActive = (href: string) => router.pathname === href;

  const NavLink: React.FC<{ item: NavItem }> = ({ item }) => {
    const active = isActive(item.href);

    return (
      <Link href={item.href} onClick={onClose}>
        <div
          className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
            active
              ? 'bg-[#e0e0e0] border-l-3 border-[#2c3e50] text-[#2c3e50] font-medium'
              : 'text-[#333] hover:bg-[#f5f5f5]'
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Logo */}
      <div className="p-6 border-b border-[#e0e0e0]">
        <h1 className="text-xl font-bold text-[#2c3e50]">EduSync</h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4">
        {mainNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Divider */}
        <div className="my-4 mx-4 border-t border-[#e0e0e0]"></div>

        {/* Secondary Navigation */}
        {secondaryNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 h-full w-56 border-r border-[#e0e0e0] bg-white z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={onClose}
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden fixed left-0 top-0 h-full w-64 z-50"
            >
              {sidebarContent}
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close sidebar"
              >
                <X size={24} />
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
