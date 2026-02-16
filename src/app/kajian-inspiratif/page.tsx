'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

import { KajianCard } from '@/components/kajian-inspiratif/KajianCard';
import Layout from '@/components/layouts/Layout';
import Typography from '@/components/Typography';

import { kajianEvents } from './data';

const EVENTS_PER_PAGE = 4;

export default function KajianInspiratifPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(kajianEvents.length / EVENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const endIndex = startIndex + EVENTS_PER_PAGE;
  const currentEvents = kajianEvents.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`flex h-10 w-10 items-center justify-center rounded-md border transition-colors ${
            currentPage === i
              ? 'bg-[#681819] text-white border-[#681819]'
              : 'border-[#681819] text-[#681819] hover:bg-[#681819]/10'
          }`}
        >
          {i}
        </button>,
      );
    }

    return pages;
  };

  return (
    <Layout withNavbar withFooter>
      {/* Hero Section */}
      <section className='relative h-screen w-full overflow-hidden'>
        {/* Background Image */}
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: "url('/images/kajian-inspiratif/hero.png')",
          }}
        >
          {/* Overlay for better text visibility */}
          <div className='absolute inset-0 bg-black/40' />
        </div>

        {/* Hero Content */}
        <div className='relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white'>
          <Typography
            variant='h1'
            weight='bold'
            className='mb-4 text-4xl md:text-5xl lg:text-6xl'
            font='marquisette'
          >
            Kajian Inspiratif Ramadan
          </Typography>
          <Typography variant='body' className='max-w-3xl text-base md:text-lg'>
            Temukan pencerahan hati dan pikiran bersama tokoh nasional, ulama,
            dan inspirator muda di Ramadan Kampus ITS.
          </Typography>
        </div>
      </section>

      {/* Event Grid Section */}
      <section className='bg-white py-16 px-4'>
        <div className='container mx-auto max-w-7xl'>
          {/* Section Header */}
          <div className='mb-12 text-center'>
            <Typography
              variant='h2'
              weight='bold'
              className='mb-4 text-3xl md:text-4xl text-[#681819]'
              font='marquisette'
            >
              Rangkaian Kajian Ramadan
            </Typography>
            <Typography
              variant='body'
              className='mx-auto max-w-3xl text-gray-700'
            >
              Serangkaian kajian pilihan yang menghadirkan tokoh nasional dan
              ulama inspiratif untuk menerangi Ramadanmu dengan ilmu, refleksi,
              dan penguatan iman.
            </Typography>
          </div>

          {/* Event Cards Grid */}
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-12'
            >
              {currentEvents.map((event) => (
                <KajianCard key={event.id} event={event} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='flex items-center justify-center gap-2'>
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className='flex items-center gap-1 px-4 py-2 text-[#681819] disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#9E2A2F] transition-colors'
              >
                <ChevronLeft className='h-4 w-4' />
                <span className='hidden sm:inline'>Previous</span>
              </button>

              {/* Page Numbers */}
              {renderPagination()}

              {/* Next Button */}
              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className='flex items-center gap-1 px-4 py-2 text-[#681819] disabled:opacity-50 disabled:cursor-not-allowed hover:text-[#9E2A2F] transition-colors'
              >
                <span className='hidden sm:inline'>Next</span>
                <ChevronRight className='h-4 w-4' />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer Section with Background Color */}
      <section className='bg-gradient-to-b from-white to-[#C33A3C]/10 py-8' />
    </Layout>
  );
}
