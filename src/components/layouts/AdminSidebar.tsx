'use client';

import {
  ChevronDown,
  Database,
  FileText,
  Home,
  LogOut,
  Menu,
  User,
  X,
} from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import Typography from '@/components/Typography';

import useAuthStore from '@/stores/useAuthStore';

// Sidebar navigation items
const navItems = [
  { name: 'Beranda', href: '/admin', icon: Home },
  { name: 'Laporan Keuangan', href: '/admin/laporan-keuangan', icon: FileText },
  {
    name: 'Data',
    href: '/admin/data',
    icon: Database,
    subItems: [
      { name: 'RIC', href: '/admin/ric' },
      { name: 'Event RIC', href: '/admin/ric-event' },
      { name: 'Nuzulul Quran', href: '/admin/nuzulul-quran' },
      { name: 'Khataman Akbar', href: '/admin/khataman-akbar' },
    ],
  },
];

type AdminUser = {
  name: string;
  email: string;
};

type AdminSidebarProps = {
  user: AdminUser;
  children: React.ReactNode;
};

export default function AdminSidebar({ user, children }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>('Data');
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore.useLogout();

  // Check if current path is active or is a child of a nav item
  const isItemActive = (item: (typeof navItems)[0]) => {
    if (pathname === item.href) return true;
    if (item.subItems) {
      return item.subItems.some((sub) => pathname === sub.href);
    }
    return false;
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Toggle expanded menu
  const toggleMenu = (name: string) => {
    setExpandedMenu(expandedMenu === name ? null : name);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Mobile Header */}
      <header className='fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden'>
        <Link href='/admin' className='flex items-center gap-2'>
          <NextImage
            src='/images/navbar/logo-rdk.svg'
            alt='RDK 47'
            width={36}
            height={36}
            priority
          />
          <Typography
            as='span'
            font='marquisette'
            weight='bold'
            className='text-lg text-primary-100'
          >
            RDK 47
          </Typography>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className='text-primary-100'
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-30 bg-black/50 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-full w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:top-0 top-16',
        )}
      >
        {/* Desktop Logo */}
        <div className='hidden h-20 items-center gap-3 border-b border-gray-200 px-6 lg:flex'>
          <NextImage
            src='/images/navbar/logo-rdk.svg'
            alt='RDK 47'
            width={40}
            height={40}
            priority
          />
          <Typography
            as='span'
            font='marquisette'
            weight='bold'
            className='text-xl text-primary-100'
          >
            RDK 47
          </Typography>
        </div>

        {/* Admin Profile */}
        <div className='border-b border-gray-200 px-4 py-4'>
          <div className='flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100'>
              <User size={18} className='text-gray-600' />
            </div>
            <div className='flex flex-col'>
              <Typography
                as='span'
                font='zabal'
                weight='bold'
                className='text-sm text-gray-800'
              >
                {user.name}
              </Typography>
              <Typography
                as='span'
                font='zabal'
                className='text-xs text-gray-500'
              >
                {user.email}
              </Typography>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex flex-col gap-1 px-4 py-4'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenu === item.name;

            if (hasSubItems) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-colors',
                      isActive
                        ? 'bg-primary-100/10 text-primary-100'
                        : 'text-gray-600 hover:bg-gray-100',
                    )}
                  >
                    <div className='flex items-center gap-3'>
                      <Icon size={18} />
                      <Typography
                        as='span'
                        font='zabal'
                        weight={isActive ? 'medium' : 'regular'}
                        className='text-sm'
                      >
                        {item.name}
                      </Typography>
                    </div>
                    <ChevronDown
                      size={16}
                      className={cn(
                        'transition-transform',
                        isExpanded && 'rotate-180',
                      )}
                    />
                  </button>
                  {isExpanded && (
                    <div className='ml-6 mt-1 flex flex-col gap-1 border-l border-gray-200 pl-3'>
                      {item.subItems?.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                              'rounded-lg px-3 py-2 text-sm transition-colors',
                              isSubActive
                                ? 'bg-primary-100/10 font-medium text-primary-100'
                                : 'text-gray-600 hover:bg-gray-100',
                            )}
                          >
                            <Typography
                              as='span'
                              font='zabal'
                              weight={isSubActive ? 'medium' : 'regular'}
                              className='text-sm'
                            >
                              {subItem.name}
                            </Typography>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                  isActive
                    ? 'bg-primary-100/10 text-primary-100'
                    : 'text-gray-600 hover:bg-gray-100',
                )}
              >
                <Icon size={18} />
                <Typography
                  as='span'
                  font='zabal'
                  weight={isActive ? 'medium' : 'regular'}
                  className='text-sm'
                >
                  {item.name}
                </Typography>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className='absolute bottom-0 left-0 right-0 border-t border-gray-200 px-4 py-4'>
          <button
            onClick={handleLogout}
            className='flex w-full items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 text-gray-600 transition-colors hover:bg-gray-100'
          >
            <LogOut size={18} />
            <Typography as='span' font='zabal' className='text-sm'>
              Keluar
            </Typography>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className='pt-16 lg:ml-64 lg:pt-0'>
        <div className='p-6 lg:p-8'>{children}</div>
      </main>
    </div>
  );
}
