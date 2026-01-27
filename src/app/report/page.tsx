'use client';

import * as React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useFinanceReport } from '@/hooks/useFinanceReport';

import Layout from '@/components/layouts/Layout';
import Typography from '@/components/Typography';

import { formatIDR } from '@/utils/format';

import { FinanceReportDetails } from '@/types/finance';

// Date formatter helper
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return (
    date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' WIB'
  );
};

export default function ReportPage() {
  const { getFinanceReportDetails } = useFinanceReport();
  const [data, setData] = React.useState<FinanceReportDetails | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getFinanceReportDetails();
      if (result) {
        setData(result);
      }
      setLoading(false);
    };
    fetchData();
  }, [getFinanceReportDetails]);

  // Loading Skeleton
  if (loading) {
    return (
      <Layout withNavbar withFooter>
        <section className='min-h-screen bg-[#FDFBF7] px-4 py-24 md:px-12 lg:px-24'>
          <div className='mx-auto max-w-7xl space-y-8 animate-pulse'>
            <div className='h-8 w-64 bg-gray-200 rounded'></div>
            <div className='h-64 w-full rounded-[32px] bg-gray-200'></div>
            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
              <div className='h-96 w-full rounded-[32px] bg-gray-200'></div>
              <div className='h-96 w-full rounded-[32px] bg-gray-200'></div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout withNavbar withFooter>
      <section className='min-h-screen bg-[#FDFBF7] px-4 py-24 md:px-12 lg:px-24'>
        <div className='mx-auto max-w-7xl space-y-8'>
          {/* Header */}
          <div>
            <Typography
              as='h1'
              variant='h2'
              font='marquisette'
              weight='bold'
              className='text-[#681819] text-center text-3xl lg:text-5xl md:text-left'
            >
              Laporan Keuangan
            </Typography>
          </div>

          {/* Saldo Terkini Card */}
          <div className='flex h-64 w-full flex-col items-center justify-center rounded-[32px] border border-gray-100 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_8px_32px_rgba(104,24,25,0.08)]'>
            <Typography
              as='div'
              font='marquisette'
              weight='bold'
              className='text-center text-4xl md:text-5xl text-[#681819] lg:text-6xl'
            >
              {data ? formatIDR(data.total_balance) : 'Rp0'}
            </Typography>
            <Typography
              as='div'
              font='zabal'
              weight='bold'
              className='mt-4 text-center text-sm md:text-xl text-black tracking-wide'
            >
              Saldo Terkini
            </Typography>
          </div>

          {/* Charts Grid */}
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
            {/* Income Chart */}
            <div className='flex flex-col justify-between rounded-[32px] border border-gray-100 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_8px_32px_rgba(104,24,25,0.08)]'>
              <div className='mb-6'>
                <Typography
                  as='h3'
                  font='zabal'
                  weight='bold'
                  className='text-lg md:text-xl text-black'
                >
                  Pemasukan
                </Typography>
                <Typography
                  as='div'
                  font='marquisette'
                  weight='bold'
                  className='my-3 text-3xl md:text-5xl lg:text-4xl text-[#681819]'
                >
                  {data ? formatIDR(data.income.total) : 'Rp0'}
                </Typography>
                <Typography
                  as='p'
                  font='zabal'
                  weight='medium'
                  className='text-[10px] md:text-xs lg:text-sm text-gray-400 uppercase tracking-widest'
                >
                  *TERAKHIR DIPERBARUI{' '}
                  {data ? formatDate(data.income.last_updated) : '-'}
                </Typography>
              </div>
              <div className='h-64 w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart
                    data={data?.income.history || []}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id='colorIncome'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop
                          offset='5%'
                          stopColor='#FCD34D'
                          stopOpacity={0.1}
                        />
                        <stop
                          offset='95%'
                          stopColor='#FCD34D'
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray='3 3'
                      stroke='#E5E7EB'
                    />
                    <XAxis
                      dataKey='name'
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    />
                    <Tooltip />
                    {/* Yellow Line */}
                    <Area
                      type='monotone'
                      dataKey='value'
                      stroke='#FCD34D'
                      strokeWidth={2}
                      fill='url(#colorIncome)'
                      dot={{
                        fill: '#FCD34D',
                        stroke: '#fff',
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expense Chart */}
            <div className='flex flex-col justify-between rounded-[32px] border border-gray-100 bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_8px_32px_rgba(104,24,25,0.08)]'>
              <div className='mb-6'>
                <Typography
                  as='h3'
                  font='zabal'
                  weight='bold'
                  className='text-lg md:text-xl text-black'
                >
                  Pengeluaran
                </Typography>
                <Typography
                  as='div'
                  font='marquisette'
                  weight='bold'
                  className='my-3 text-3xl md:text-5xl lg:text-4xl text-[#681819]'
                >
                  {data ? formatIDR(data.expense.total) : 'Rp0'}
                </Typography>
                <Typography
                  as='p'
                  font='zabal'
                  weight='medium'
                  className='text-[10px] md:text-xs lg:text-sm text-gray-400 uppercase tracking-widest'
                >
                  *TERAKHIR DIPERBARUI{' '}
                  {data ? formatDate(data.expense.last_updated) : '-'}
                </Typography>
              </div>
              <div className='h-64 w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart
                    data={data?.expense.history || []}
                    margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray='3 3'
                      stroke='#E5E7EB'
                    />
                    <XAxis
                      dataKey='name'
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 10 }}
                    />
                    <Tooltip />
                    {/* Purple Line for Expense - Keeping secondary color theme */}
                    <Area
                      type='monotone'
                      dataKey='value'
                      stroke='#A78BFA'
                      strokeWidth={2}
                      fill='transparent'
                      dot={{
                        fill: '#A78BFA',
                        stroke: '#fff',
                        strokeWidth: 2,
                        r: 4,
                      }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
