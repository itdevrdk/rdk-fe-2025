'use client';

import { ArrowUpRight, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { cn } from '@/lib/utils';

import AdminSidebar from '@/components/layouts/AdminSidebar';
import Loading from '@/components/Loading';
import Typography from '@/components/Typography';

import {
  useGetDashboardStats,
  useGetEventDistribution,
  useGetFundFlow,
  useGetVisitorStats,
} from '@/app/admin/hook/useDashboard';
import { useGetSuggestions } from '@/app/admin/suggestions/hook/useSuggestion';

import { useGetMe } from './hook/getMe';

import { SuggestionStatus } from '@/types/entities/suggestion';

// --- COMPONENTS ---

// 1. Stats Card
interface StatsCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
}

const StatsCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendValue,
}: StatsCardProps) => (
  <div className='flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md'>
    <div className='mb-4 flex items-center justify-between'>
      <div className='rounded-full bg-primary-50 p-3'>
        <Icon className='h-6 w-6 text-primary-600' />
      </div>
      {trend && trendValue !== undefined && (
        <span
          className={cn(
            'flex items-center text-xs font-medium',
            trend === 'up'
              ? 'text-green-600'
              : trend === 'down'
                ? 'text-red-600'
                : 'text-gray-600',
          )}
        >
          {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
          {trendValue}%{' '}
          {trend === 'up' ? <ArrowUpRight className='ml-1 h-3 w-3' /> : null}
        </span>
      )}
    </div>
    <Typography as='h3' variant='h5' className='font-bold text-gray-900'>
      {value}
    </Typography>
    <Typography
      as='p'
      variant='body'
      className='mt-1 font-medium text-gray-500'
    >
      {title}
    </Typography>
    {subtext && (
      <Typography as='span' variant='label' className='mt-2 text-gray-400'>
        {subtext}
      </Typography>
    )}
  </div>
);

// 2. Feedback Widget
import { Suggestion } from '@/types/entities/suggestion';

const FeedbackWidget = ({ suggestions }: { suggestions: Suggestion[] }) => {
  return (
    <div className='flex h-full flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm'>
      <div className='mb-6 flex items-center justify-between'>
        <Typography as='h3' variant='h6' className='font-bold text-gray-900'>
          Masukan Terbaru
        </Typography>
        <Link
          href='/admin/suggestions'
          className='text-xs font-medium text-primary-600 hover:underline'
        >
          Lihat Semua
        </Link>
      </div>
      <div className='flex-1 space-y-4 overflow-y-auto pr-2'>
        {suggestions.length > 0 ? (
          suggestions.map((item) => (
            <div
              key={item.suggestion_id}
              className='rounded-lg border border-gray-50 bg-gray-50 p-3 transition-colors hover:bg-gray-100'
            >
              <div className='mb-1 flex items-center justify-between'>
                <span className='font-semibold text-gray-800 text-sm'>
                  {item.name}
                </span>
                <span className='text-[10px] text-gray-400'>
                  {new Date(item.timestamp).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
              <p className='line-clamp-2 text-xs text-gray-600'>
                {item.suggestion}
              </p>
            </div>
          ))
        ) : (
          <div className='flex h-full items-center justify-center text-center text-gray-400'>
            <Typography variant='label'>Belum ada masukan baru</Typography>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN PAGE ---

export default function AdminDashboard() {
  const { user, isLoading: isUserLoading, isError: isUserError } = useGetMe();

  // Fetch Data Hooks
  const { data: dashboardStats } = useGetDashboardStats();
  const { data: fundFlowData } = useGetFundFlow('7_days');
  const { data: eventDistribution } = useGetEventDistribution();
  const { data: visitorStats } = useGetVisitorStats('7_days');
  const { data: suggestionData } = useGetSuggestions({
    limit: 5,
    status: SuggestionStatus.NEW,
  });

  // Loading State
  if (isUserLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loading />
      </div>
    );
  }

  if (isUserError || !user) return null;

  // --- DATA PROCESSING ---

  // 1. Chart Data: Fund Flow
  const chartFundData =
    fundFlowData?.map((r) => ({
      name: new Date(r.date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      }),
      income: r.total_income,
      expenses: r.total_expenses,
    })) || [];

  // 2. Chart Data: Event Distribution
  const pieChartData =
    eventDistribution?.map((e) => ({
      name: e.event_type,
      value: e.count,
    })) || [];

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884d8',
    '#82ca9d',
  ];

  // 3. Chart Data: Visitor Stats
  const visitorChartData =
    visitorStats?.map((v) => ({
      name: new Date(v.date).toLocaleDateString('id-ID', {
        day: 'numeric', // e.g. "Sen" if data is formatted that way, but date is ISO
        month: 'short',
      }),
      visitors: v.visitors,
      // Add day name if needed, but simple date is fine
    })) || [];

  // 4. Suggestions
  const newSuggestions = suggestionData?.data || [];

  return (
    <AdminSidebar user={user}>
      {/* Page Header */}
      <div className='mb-8'>
        <Typography
          as='h1'
          font='marquisette'
          variant='h4'
          className='text-primary-100'
        >
          Beranda Admin
        </Typography>
        <Typography as='p' className='text-gray-500'>
          Ringkasan aktivitas dan performa RDK ITS
        </Typography>
      </div>

      {/* Stats Grid */}
      <div className='mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        <StatsCard
          title='Dana Terkumpul'
          value={`${dashboardStats?.fund_target_percentage ?? 0}%`}
          subtext={`Dari target Rp ${(dashboardStats?.fund_target_value ?? 0).toLocaleString('id-ID')}`}
          icon={TrendingUp}
          trend='up'
        />
        <StatsCard
          title='Total Peserta'
          value={dashboardStats?.total_participants ?? 0}
          subtext='Peserta hadir di seluruh kajian'
          icon={Users}
          trend='up'
        />
        <StatsCard
          title='Pengunjung Web'
          value={(dashboardStats?.total_visitors_weekly ?? 0).toLocaleString(
            'id-ID',
          )}
          subtext='Total pengunjung minggu ini'
          icon={ArrowUpRight}
          trend={dashboardStats?.visitors_trend}
          trendValue={dashboardStats?.visitors_trend_value}
        />
      </div>

      {/* Charts Section */}
      <div className='space-y-6'>
        {/* Row 1: Fund Flow (Lines) & Participants (Pie) */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-10'>
          {/* Fund Flow Chart (70% -> col-span-7) */}
          <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-7'>
            <Typography
              as='h3'
              variant='h6'
              className='mb-6 font-bold text-gray-900'
            >
              Arus Dana Harian
            </Typography>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={chartFundData}>
                <CartesianGrid strokeDasharray='3 3' stroke='#f3f4f6' />
                <XAxis
                  dataKey='name'
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value?: number) =>
                    `Rp ${(value || 0).toLocaleString('id-ID')}`
                  }
                />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='income'
                  name='Pemasukan'
                  stroke='#10b981'
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: '#10b981',
                    strokeWidth: 2,
                    stroke: '#fff',
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='expenses'
                  name='Pengeluaran'
                  stroke='#ef4444'
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: '#ef4444',
                    strokeWidth: 2,
                    stroke: '#fff',
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Participant Pie Chart (30% -> col-span-3) */}
          <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-3'>
            <Typography
              as='h3'
              variant='h6'
              className='mb-6 font-bold text-gray-900'
            >
              Peserta per Event
            </Typography>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey='value'
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  layout='vertical'
                  verticalAlign='bottom'
                  align='center'
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2: Visitors (Line) & Feedback (Widget) */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-10'>
          {/* Visitor Chart (70% -> col-span-7) */}
          <div className='rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-7'>
            <Typography
              as='h3'
              variant='h6'
              className='mb-6 font-bold text-gray-900'
            >
              Pengunjung Website
            </Typography>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={visitorChartData}>
                <CartesianGrid strokeDasharray='3 3' stroke='#f3f4f6' />
                <XAxis
                  dataKey='name'
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line
                  type='monotone'
                  dataKey='visitors'
                  name='Pengunjung'
                  stroke='#3b82f6'
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Feedback Widget (30% -> col-span-3) */}
          <div className='lg:col-span-3'>
            <FeedbackWidget suggestions={newSuggestions} />
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}
