'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import AdminSidebar from '@/components/layouts/AdminSidebar';
import Loading from '@/components/Loading';
import Typography from '@/components/Typography';

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

// Stats cards data
const statsCards = [
  { title: 'Jumlah Pendaftar', value: 1200 },
  { title: 'Jumlah Pendaftar', value: 1200 },
  { title: 'Jumlah Pendaftar', value: 1200 },
  { title: 'Jumlah Pendaftar', value: 1200 },
];

export default function AdminDashboard() {
  // Fetch user data from /me endpoint
  const { user, isLoading, isError } = useGetMe();

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
    <AdminSidebar user={user}>
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
    </AdminSidebar>
  );
}
