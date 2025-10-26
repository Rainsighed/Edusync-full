import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, requireAuth = false }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="md:ml-56">
        {/* Mobile Hamburger Menu */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-[#e0e0e0] p-4 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-[#2c3e50] hover:text-[#1a252f] transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Main Content Area */}
        <main className="p-6 md:p-8 pt-20 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
};
