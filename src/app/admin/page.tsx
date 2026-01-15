'use client';

import { Database, FileText, Home, LogOut, Menu, User, X } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { cn } from '@/lib/utils';

import Loading from '@/components/Loading';
import Typography from '@/components/Typography';

import useAuthStore from '@/stores/useAuthStore';

import { useGetMe } from './hook/getMe';

// Sample data for the charts
const chartData1 = [
  { name: 'Jan', yellow: 200, purple: -550 },
  { name: 'Feb', yellow: 900, purple: -450 },
  { name: 'Mar', yellow: 100, purple: -500 },
  { name: 'Apr', yellow: 200, purple: -400 },
  { name: 'May', yellow: -100, purple: -350 },
  { name: 'Jun', yellow: -200, purple: -450 },
  { name: 'Jul', yellow: 400, purple: 0 },
];

const chartData2 = [
  { name: 'Jan', yellow: -600, purple: -700 },
  { name: 'Feb', yellow: 900, purple: -450 },
  { name: 'Mar', yellow: 500, purple: -550 },
  { name: 'Apr', yellow: 200, purple: -350 },
  { name: 'May', yellow: -100, purple: -450 },
  { name: 'Jun', yellow: -200, purple: -400 },
  { name: 'Jul', yellow: 500, purple: 0 },
];

// Sidebar navigation items
const navItems = [
  { name: 'Beranda', href: '/admin', icon: Home },
  { name: 'Laporan Keuangan', href: '/admin/laporan-keuangan', icon: FileText },
  { name: 'Data', href: '/admin/data', icon: Database },
];

// Stats cards data
const statsCards = [
  { title: 'Jumlah Pendaftar', value: 1200 },
  { title: 'Jumlah Pendaftar', value: 1200 },
  { title: 'Jumlah Pendaftar', value: 1200 },
  { title: 'Jumlah Pendaftar', value: 1200 },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('Beranda');
  const router = useRouter();
  const logout = useAuthStore.useLogout();

  // Fetch user data from /me endpoint
  const { user, isLoading, isError } = useGetMe();

  // Handle logout
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loading />
      </div>
    );
  }

  // If error (401 will redirect automatically via useGetMe hook)
  if (isError || !user) {
    return null;
  }

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
            const isActive = activePage === item.name;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  setActivePage(item.name);
                  setSidebarOpen(false);
                }}
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
        <div className='p-6 lg:p-8'>
          {/* Page Title */}
          <Typography
            as='h1'
            font='marquisette'
            variant='h4'
            className='mb-6 text-primary-100'
          >
            Beranda
          </Typography>

          {/* Stats Cards */}
          <div className='mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4'>
            {statsCards.map((card, index) => (
              <div
                key={index}
                className='rounded-xl border border-gray-200 bg-white p-4 lg:p-6'
              >
                <Typography
                  as='p'
                  font='marquisette'
                  variant='h4'
                  className='mb-1 text-center text-primary-100'
                >
                  {card.value}
                </Typography>
                <Typography
                  as='p'
                  font='zabal'
                  className='text-center text-xs text-gray-600 lg:text-sm'
                >
                  {card.title}
                </Typography>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <Typography
            as='h2'
            font='marquisette'
            variant='h5'
            className='mb-4 text-primary-100'
          >
            Grafik
          </Typography>

          <div className='space-y-6'>
            {/* Chart 1 */}
            <div className='rounded-xl border border-gray-200 bg-white p-4 lg:p-6'>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={chartData1}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                  <XAxis
                    dataKey='name'
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip />
                  <Line
                    type='monotone'
                    dataKey='yellow'
                    stroke='#ffc862'
                    strokeWidth={2}
                    dot={{ fill: '#ffc862', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='purple'
                    stroke='#8884d8'
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 2 */}
            <div className='rounded-xl border border-gray-200 bg-white p-4 lg:p-6'>
              <ResponsiveContainer width='100%' height={300}>
                <LineChart data={chartData2}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
                  <XAxis
                    dataKey='name'
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip />
                  <Line
                    type='monotone'
                    dataKey='yellow'
                    stroke='#ffc862'
                    strokeWidth={2}
                    dot={{ fill: '#ffc862', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type='monotone'
                    dataKey='purple'
                    stroke='#8884d8'
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
