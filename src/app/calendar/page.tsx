'use client';

import { ChevronLeft, MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { useEvent } from '@/hooks/useEvent';

import Layout from '@/components/layouts/Layout';
import Typography from '@/components/Typography';

import { RamadanEvent } from '@/types/event';

function pad2(n: number) {
  return n.toString().padStart(2, '0');
}

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parseLocalISO(isoLocal: string) {
  // Assuming isoLocal is "YYYY-MM-DDTHH:mm:ssZ" or similar.
  // We want to create a Date object.
  return new Date(isoLocal);
}

function getIndoDayName(d: Date) {
  return d.toLocaleDateString('id-ID', { weekday: 'long' });
}

function getIndoMonthName(d: Date) {
  return d.toLocaleDateString('id-ID', { month: 'long' });
}

function formatTimeHHmm(d: Date) {
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatHeaderDate(d: Date) {
  const dayName = getIndoDayName(d);
  const day = d.getDate();
  const monthName = getIndoMonthName(d);
  const year = d.getFullYear();
  const capDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  return `${capDay}, ${day} ${monthName} ${year}`;
}

// Helper to check if a date (from API) fits our calendar range if needed.
// For now, we display all fetched events.

export default function CalendarPage() {
  const { getEvents, loading } = useEvent();
  const [events, setEvents] = useState<RamadanEvent[]>([]);

  useEffect(() => {
    getEvents({ year: 2026 }).then((res) => {
      if (res) {
        setEvents(res);
      }
    });
  }, [getEvents]);

  const normalizedEvents = useMemo(() => {
    if (!events) return [];

    const items = events.map((e) => {
      const startDate = parseLocalISO(e.date);
      const endDate = e.end_date ? parseLocalISO(e.end_date) : startDate; // Fallback if no end date
      return { ...e, startDate, endDate, dateKey: toDateKey(startDate) };
    });

    items.sort((a, b) => {
      if (a.startDate.getTime() !== b.startDate.getTime())
        return a.startDate.getTime() - b.startDate.getTime();
      return a.endDate.getTime() - b.endDate.getTime();
    });

    return items;
  }, [events]);

  const availableDates = useMemo(() => {
    const map = new Map<string, Date>();
    for (const e of normalizedEvents) {
      if (!map.has(e.dateKey)) map.set(e.dateKey, e.startDate);
    }
    // Sort by date
    return Array.from(map.entries())
      .sort((a, b) => a[1].getTime() - b[1].getTime())
      .map(([key, date]) => ({ key, date }));
  }, [normalizedEvents]);

  const [selectedDateKey, setSelectedDateKey] = useState<string>('');

  useEffect(() => {
    if (availableDates.length > 0 && !selectedDateKey) {
      // Default to today if available, else first date
      const todayKey = toDateKey(new Date());
      const hasToday = availableDates.some((d) => d.key === todayKey);
      setSelectedDateKey(hasToday ? todayKey : availableDates[0].key);
    } else if (availableDates.length > 0) {
      // Check if selected still exists
      const stillExists = availableDates.some((d) => d.key === selectedDateKey);
      if (!stillExists) {
        setSelectedDateKey(availableDates[0].key);
      }
    }
  }, [availableDates, selectedDateKey]);

  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDateKey) return [];
    const items = normalizedEvents.filter((e) => e.dateKey === selectedDateKey);
    items.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    return items;
  }, [normalizedEvents, selectedDateKey]);

  const selectedDateObj = useMemo(() => {
    const found = availableDates.find((d) => d.key === selectedDateKey);
    return found?.date ?? new Date();
  }, [availableDates, selectedDateKey]);

  return (
    <Layout withNavbar withFooter>
      <main className='w-full bg-white'>
        <div className='mx-auto max-w-7xl px-6 py-12'>
          {/*  HEADER  */}
          <div className='mb-8 flex items-center gap-4'>
            <button
              className='rounded border p-2'
              onClick={() => window.history.back()}
            >
              <ChevronLeft size={18} />
            </button>

            <Typography
              as='h1'
              variant='h4'
              font='marquisette'
              weight='bold'
              className='bg-gradient-to-r from-[#681819] to-[#C33A3C] bg-clip-text text-transparent'
            >
              Kalender RDK 46
            </Typography>
          </div>

          {loading && availableDates.length === 0 ? (
            <div className='py-12 text-center text-gray-500'>
              Memuat jadwal...
            </div>
          ) : (
            <>
              {/*  DATE SELECTOR  */}
              {availableDates.length === 0 ? (
                <div className='py-12 text-center text-gray-500'>
                  Belum ada kegiatan yang tersedia.
                </div>
              ) : (
                <>
                  <div className='mb-6 flex gap-4 overflow-x-auto w-full pb-1 scrollbar-hide'>
                    {availableDates.map(({ key, date }) => {
                      const active = key === selectedDateKey;
                      return (
                        <button
                          key={key}
                          type='button'
                          onClick={() => setSelectedDateKey(key)}
                          className={`min-w-[80px] rounded-xl border px-4 py-3 text-center transition ${
                            active
                              ? 'border-[#E6C89A] bg-[#FFF3D4]'
                              : 'bg-white hover:bg-[#FFF7E8]'
                          }`}
                        >
                          <Typography
                            font='marquisette'
                            variant='h6'
                            className='text-xl font-semibold bg-gradient-to-r from-[#C33A3C] to-[#681819] bg-clip-text text-transparent'
                          >
                            {date.getDate()}
                          </Typography>
                          <Typography
                            font='zabal'
                            className='text-xs text-gray-500'
                          >
                            {getIndoDayName(date).charAt(0).toUpperCase() +
                              getIndoDayName(date).slice(1)}
                          </Typography>
                        </button>
                      );
                    })}
                  </div>

                  <div className='mb-8 h-[2px] w-full bg-[#681819]' />

                  {/*  DATE LABEL  */}
                  <div className='mb-6 rounded-xl bg-gradient-to-r from-[#942B2C] to-[#C33A3C] py-2 text-center text-sm text-white text-zabal'>
                    {formatHeaderDate(selectedDateObj)}
                  </div>

                  {/*  EVENT LIST  */}
                  <div className='space-y-4'>
                    {eventsForSelectedDate.length === 0 ? (
                      <div className='rounded-xl border bg-[#FFF7E8] p-6 text-sm text-[#681819]'>
                        Tidak ada kegiatan pada tanggal ini.
                      </div>
                    ) : (
                      eventsForSelectedDate.map((e) => (
                        <div
                          key={e.id}
                          className='rounded-xl border bg-[#FFF7E8] p-4'
                        >
                          <div className='flex gap-4'>
                            <div className='w-[100px] shrink-0 text-sm font-semibold text-[#3a3a3a]'>
                              {formatTimeHHmm(e.startDate)}
                              <br />–<br />
                              {formatTimeHHmm(e.endDate)}
                            </div>

                            <div className='flex-1'>
                              <p className='mb-2 text-sm font-semibold text-[#9E2A2F]'>
                                {e.title}
                              </p>

                              <p className='mb-2 text-xs text-gray-600'>
                                {e.description}
                              </p>

                              <div className='flex flex-col gap-1 text-xs text-[#681819]'>
                                {/* Speaker field removed as it is not in API based on requirements, 
                                    but if description contains it, we show description. 
                                    If there is a location: */}
                                <p>
                                  <MapPin className='inline mr-1 w-4 h-4' />
                                  {e.location}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}
