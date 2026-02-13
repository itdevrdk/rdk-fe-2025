'use client';

import {
  Calendar,
  ChevronDown,
  ClipboardList,
  Database,
  FileText,
  Home,
  Link as LinkIcon,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  QrCode,
  User,
  X,
} from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import Typography from '@/components/Typography';

import useAuthStore from '@/stores/useAuthStore';

import { AdminRole } from '@/types/entities/user';

// Sidebar navigation items with role-based access control
const navItems = [
  {
    name: 'Beranda',
    href: '/admin',
    icon: Home,
    allowedRoles: ['admin', 'event', 'mentoring', 'publication'] as AdminRole[],
  },
  {
    name: 'Kegiatan Ramadhan',
    href: '/admin/ramadan-events',
    icon: Calendar,
    allowedRoles: ['admin', 'event', 'publication'] as AdminRole[],
  },
  {
    name: 'Laporan Keuangan',
    href: '/admin/finance',
    icon: FileText,
    allowedRoles: ['admin'] as AdminRole[],
  },
  {
    name: 'Shorten Link',
    href: '/admin/shorten-link',
    icon: LinkIcon,
    allowedRoles: ['admin', 'event', 'publication'] as AdminRole[],
  },
  {
    name: 'QR Generator',
    href: '/admin/qr-generator',
    icon: QrCode,
    allowedRoles: ['admin', 'event', 'publication'] as AdminRole[],
  },
  {
    name: 'Masukan',
    href: '/admin/suggestions',
    icon: FileText,
    allowedRoles: ['admin', 'event', 'publication'] as AdminRole[],
  },
  {
    name: 'Presence System',
    href: '',
    icon: ClipboardList,
    allowedRoles: ['admin'] as AdminRole[],
    subItems: [
      { name: 'Check Presensi', href: '/admin/presence/check' },
      { name: 'Data Presensi', href: '/admin/presence' },
      { name: 'Data Panitia', href: '/admin/committe' },
      { name: 'Data Event', href: '/admin/committe-event' },
    ],
  },
  {
    name: 'RIC',
    href: '',
    icon: Database,
    allowedRoles: ['admin', 'event'] as AdminRole[],
    subItems: [
      { name: 'Data Peserta RIC', href: '/admin/ric' },
      { name: 'Data Event RIC', href: '/admin/ric-event' },
    ],
  },
  {
    name: 'Khataman Akbar',
    href: '/admin/khataman-akbar',
    icon: Database,
    allowedRoles: ['admin', 'event'] as AdminRole[],
  },
  {
    name: 'Nuzulul Quran',
    href: '',
    icon: Calendar,
    allowedRoles: ['admin', 'event'] as AdminRole[],
    subItems: [
      { name: 'Check RSVP', href: '/admin/nuzulul-quran/check' },
      { name: 'Data RSVP', href: '/admin/nuzulul-quran' },
    ],
  },
];

type AdminUser = {
  name: string;
  email: string;
  role: string;
};

type AdminSidebarProps = {
  user: AdminUser;
  children: React.ReactNode;
};

// Helper function to filter menu items based on user role
const getFilteredNavItems = (userRole: string) => {
  return navItems.filter((item) =>
    item.allowedRoles.includes(userRole as AdminRole),
  );
};

// Helper function to determine which menu should be expanded based on pathname
const getExpandedMenuFromPathname = (
  pathname: string,
  filteredItems: typeof navItems,
): string | null => {
  const menuItem = filteredItems.find((item) => {
    if (!item.subItems) return false;
    return item.subItems.some((sub) => pathname.startsWith(sub.href));
  });
  return menuItem ? menuItem.name : null;
};

export default function AdminSidebar({ user, children }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore.useLogout();
  const prevPathnameRef = useRef(pathname);

  // Filter navigation items based on user role (memoized to prevent unnecessary recalculation)
  const filteredNavItems = useMemo(
    () => getFilteredNavItems(user.role),
    [user.role],
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(() =>
    getExpandedMenuFromPathname(pathname, filteredNavItems),
  );

  // Update expanded menu when pathname changes
  useEffect(() => {
    // Only update if pathname actually changed (prevents override on manual toggle)
    if (prevPathnameRef.current !== pathname) {
      const newExpandedMenu = getExpandedMenuFromPathname(
        pathname,
        filteredNavItems,
      );
      setExpandedMenu(newExpandedMenu);
      prevPathnameRef.current = pathname;
    }
  }, [pathname, filteredNavItems]);

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

  // ... inside component ...
  const [isCollapsed, setIsCollapsed] = useState(false);

  // ...

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Mobile Header */}
      <header className='fixed top-0 left-0 right-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden'>
        <Link href='/admin' className='flex items-center gap-2'>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className='text-primary-100'
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
          'fixed left-0 top-0 z-40 h-full transform border-r border-gray-200 bg-white transition-all duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          isCollapsed ? 'lg:w-20' : 'lg:w-64',
          'lg:translate-x-0',
          'lg:top-0 top-16',
          'flex flex-col',
        )}
      >
        {/* Desktop Logo & Toggle */}
        <div
          className={cn(
            'hidden h-20 flex-shrink-0 items-center border-b border-gray-200 lg:flex',
            isCollapsed ? 'justify-center' : 'justify-between px-6',
          )}
        >
          {!isCollapsed && (
            <div className='flex items-center gap-3'>
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
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className='text-gray-500 hover:text-primary-100'
          >
            {isCollapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </button>
        </div>

        {/* Admin Profile */}
        <div
          className={cn(
            'flex-shrink-0 border-b border-gray-200 py-4',
            isCollapsed ? 'px-2' : 'px-4',
          )}
        >
          <div
            className={cn(
              'flex items-center rounded-lg border border-gray-200 py-2',
              isCollapsed
                ? 'justify-center border-0 bg-transparent'
                : 'gap-3 px-3 bg-white',
            )}
          >
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100'>
              <User size={18} className='text-gray-600' />
            </div>
            {!isCollapsed && (
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
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4'>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenu === item.name;

            if (hasSubItems) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => !isCollapsed && toggleMenu(item.name)}
                    className={cn(
                      'flex w-full items-center rounded-lg py-2.5 transition-colors',
                      isActive
                        ? 'bg-primary-100/10 text-primary-100'
                        : 'text-gray-600 hover:bg-gray-100',
                      isCollapsed ? 'justify-center' : 'justify-between px-3',
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <div className='flex items-center gap-3'>
                      <Icon size={18} />
                      {!isCollapsed && (
                        <Typography
                          as='span'
                          font='zabal'
                          weight={isActive ? 'medium' : 'regular'}
                          className='text-sm'
                        >
                          {item.name}
                        </Typography>
                      )}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown
                        size={16}
                        className={cn(
                          'transition-transform',
                          isExpanded && 'rotate-180',
                        )}
                      />
                    )}
                  </button>
                  {!isCollapsed && isExpanded && (
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
                  'flex items-center rounded-lg py-2.5 transition-colors',
                  isActive
                    ? 'bg-primary-100/10 text-primary-100'
                    : 'text-gray-600 hover:bg-gray-100',
                  isCollapsed ? 'justify-center' : 'gap-3 px-3',
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon size={18} />
                {!isCollapsed && (
                  <Typography
                    as='span'
                    font='zabal'
                    weight={isActive ? 'medium' : 'regular'}
                    className='text-sm'
                  >
                    {item.name}
                  </Typography>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className='flex-shrink-0 border-t border-gray-200 px-2 py-4'>
          <button
            onClick={handleLogout}
            className={cn(
              'flex w-full items-center rounded-lg border border-gray-200 py-2.5 text-gray-600 transition-colors hover:bg-gray-100',
              isCollapsed ? 'justify-center border-0' : 'gap-3 px-3',
            )}
            title={isCollapsed ? 'Keluar' : undefined}
          >
            <LogOut size={18} />
            {!isCollapsed && (
              <Typography as='span' font='zabal' className='text-sm'>
                Keluar
              </Typography>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 transition-all duration-300 lg:pt-0',
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64',
        )}
      >
        <div className='p-6 lg:p-8'>{children}</div>
      </main>
    </div>
  );
}
