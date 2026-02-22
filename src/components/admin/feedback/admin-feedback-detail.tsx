'use client';

import * as React from 'react';

import { getRatingConfig } from '@/lib/feedback';

import Modal from '@/components/Modal';
import Typography from '@/components/Typography';

import { useGetFeedbackDetail } from '@/app/admin/feedback/hook/useFeedback';

interface AdminFeedbackDetailProps {
  isOpen: boolean;
  onClose: () => void;
  feedbackId: string | null;
}

export default function AdminFeedbackDetail({
  isOpen,
  onClose,
  feedbackId,
}: AdminFeedbackDetailProps) {
  const { data, isLoading } = useGetFeedbackDetail(feedbackId || '', {
    enabled: !!feedbackId && isOpen,
  });

  const feedback = data?.data;
  const ratingConfig = feedback ? getRatingConfig(feedback.rating) : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Detail Feedback'>
      {isLoading ? (
        <div className='space-y-4'>
          <div className='h-6 w-32 animate-pulse rounded bg-gray-200' />
          <div className='h-20 w-full animate-pulse rounded bg-gray-200' />
          <div className='h-4 w-48 animate-pulse rounded bg-gray-200' />
        </div>
      ) : feedback ? (
        <div className='space-y-4'>
          {/* Name */}
          <div>
            <Typography variant='body' className='text-sm text-gray-500'>
              Nama
            </Typography>
            <Typography variant='body' className='font-medium text-gray-900'>
              {feedback.name}
            </Typography>
          </div>

          {/* Rating */}
          <div>
            <Typography variant='body' className='text-sm text-gray-500'>
              Rating
            </Typography>
            {ratingConfig && (
              <div className='mt-1 flex items-center gap-2'>
                <span className='text-3xl'>{ratingConfig.emoji}</span>
                <span
                  className='inline-flex items-center rounded-full px-3 py-1 text-sm font-medium'
                  style={{
                    backgroundColor: ratingConfig.bgColor,
                    color: ratingConfig.color,
                  }}
                >
                  {ratingConfig.label}
                </span>
                <span className='text-sm text-gray-500'>
                  ({ratingConfig.score}/5)
                </span>
              </div>
            )}
          </div>

          {/* Message */}
          <div>
            <Typography variant='body' className='text-sm text-gray-500'>
              Pesan
            </Typography>
            <div className='mt-1 rounded-lg bg-gray-50 p-4'>
              <Typography
                variant='body'
                className='whitespace-pre-wrap text-gray-700'
              >
                {feedback.message}
              </Typography>
            </div>
          </div>

          {/* Event */}
          <div>
            <Typography variant='body' className='text-sm text-gray-500'>
              Kegiatan yang Diikuti
            </Typography>
            <div className='mt-1'>
              <span className='inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800'>
                {feedback.event}
              </span>
            </div>
          </div>

          {/* Created At */}
          <div>
            <Typography variant='body' className='text-sm text-gray-500'>
              Waktu Submit
            </Typography>
            <Typography variant='body' className='text-gray-700'>
              {new Date(feedback.created_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </div>
        </div>
      ) : (
        <div className='py-8 text-center'>
          <Typography variant='body' className='text-gray-500'>
            Feedback tidak ditemukan
          </Typography>
        </div>
      )}
    </Modal>
  );
}
