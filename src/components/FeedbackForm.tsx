/**
 * Feedback Form Component
 *
 * Demonstrates how to use the useFeedback hook for submitting feedback
 */

'use client';

import { CheckCircle, ChevronDown } from 'lucide-react';
import { useEffect,useRef, useState } from 'react';

import { RATING_CONFIG, validateFeedbackForm } from '@/lib/feedback';
import { useFeedback } from '@/hooks/useFeedback';

import Button from '@/components/buttons/Button';
import Typography from '@/components/Typography';

import {
  EMOJI_RATINGS,
  FeedbackCreateRequest,
  FeedbackRating,
} from '@/types/feedback';
import { VALID_EVENT_NAMES } from '@/types/rsvp';

interface FeedbackFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Form component for submitting feedback
 *
 * @example
 * ```tsx
 * <FeedbackForm
 *   onSuccess={() => showToast('Terima kasih!')}
 *   onError={(error) => showErrorToast(error)}
 * />
 * ```
 */
export function FeedbackForm({ onSuccess, onError }: FeedbackFormProps) {
  const { loading, error: apiError, submitFeedback } = useFeedback();

  const [formData, setFormData] = useState<FeedbackCreateRequest>({
    name: '',
    rating: 'neutral',
    message: '',
    event: '',
  });

  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [submitted, setSubmitted] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsEventDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const maxMessageLength = 1000;
  const messageLength = formData.message.length;
  const messagePercentage = (messageLength / maxMessageLength) * 100;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      name: e.target.value,
    }));
    if (validationErrors.name) {
      setValidationErrors((prev) => ({
        ...prev,
        name: '',
      }));
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let value = e.target.value;
    if (value.length > maxMessageLength) {
      value = value.substring(0, maxMessageLength);
    }
    setFormData((prev) => ({
      ...prev,
      message: value,
    }));
    if (validationErrors.message) {
      setValidationErrors((prev) => ({
        ...prev,
        message: '',
      }));
    }
  };

  const handleRatingChange = (rating: FeedbackRating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
    if (validationErrors.rating) {
      setValidationErrors((prev) => ({
        ...prev,
        rating: '',
      }));
    }
  };

  const handleEventSelect = (eventName: string) => {
    const newEvent = selectedEvent === eventName ? '' : eventName;
    setSelectedEvent(newEvent);
    setFormData((prev) => ({ ...prev, event: newEvent }));
    setIsEventDropdownOpen(false);
    if (validationErrors.event) {
      setValidationErrors((prev) => ({
        ...prev,
        event: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateFeedbackForm(formData);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors({});

    try {
      const response = await submitFeedback(formData);

      if (response.status) {
        setSubmitted(true);
        setFormData({
          name: '',
          rating: 'neutral',
          message: '',
          event: '',
        });
        setSelectedEvent('');
        onSuccess?.();
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch {
      const errorMessage =
        apiError?.message || 'Gagal mengirim feedback. Silakan coba lagi.';
      onError?.(errorMessage);
    }
  };

  if (submitted) {
    return (
      <div className='mx-auto max-w-lg rounded-xl border border-green-200 bg-green-50 p-8 text-center'>
        <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
          <CheckCircle className='h-10 w-10 text-green-600' />
        </div>
        <Typography variant='h4' className='mb-2 text-green-800'>
          Terima kasih atas feedback Anda!
        </Typography>
        <Typography variant='body' className='text-green-700'>
          Feedback Anda sangat membantu kami untuk meningkatkan layanan.
        </Typography>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto flex max-w-lg flex-col gap-5'
    >
      {/* Name Field */}
      <div className='flex flex-col gap-1.5'>
        <label htmlFor='name' className='text-sm font-semibold text-gray-700'>
          Nama Anda <span className='text-red-500'>*</span>
        </label>
        <input
          id='name'
          type='text'
          value={formData.name}
          onChange={handleNameChange}
          placeholder='Masukkan nama Anda'
          maxLength={100}
          className={`w-full rounded-lg border px-4 py-3 text-gray-900 transition-all focus:outline-none focus:ring-2 ${
            validationErrors.name
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-primary-100 focus:ring-primary-100/20'
          }`}
        />
        {validationErrors.name && (
          <span className='text-sm text-red-500'>{validationErrors.name}</span>
        )}
      </div>

      {/* Events Field */}
      <div className='flex flex-col gap-1.5'>
        <label className='text-sm font-semibold text-gray-700'>
          Kegiatan yang Diikuti <span className='text-red-500'>*</span>
        </label>
        <div ref={dropdownRef} className='relative'>
          {/* Dropdown Button */}
          <button
            type='button'
            onClick={() => setIsEventDropdownOpen(!isEventDropdownOpen)}
            className={`flex w-full items-center justify-between rounded-lg border bg-white px-4 py-3 text-left transition-all focus:outline-none focus:ring-2 ${
              validationErrors.event
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-primary-100 focus:ring-primary-100/20'
            }`}
          >
            <span className={selectedEvent ? 'text-gray-900' : 'text-gray-400'}>
              {selectedEvent || 'Pilih kegiatan'}
            </span>
            <ChevronDown
              className={`h-5 w-5 text-gray-400 transition-transform ${isEventDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isEventDropdownOpen && (
            <div className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg'>
              {VALID_EVENT_NAMES.map((eventName) => {
                const isSelected = selectedEvent === eventName;
                return (
                  <button
                    key={eventName}
                    type='button'
                    onClick={() => handleEventSelect(eventName)}
                    className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-[#681819]/5 text-[#681819] font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                        isSelected
                          ? 'border-[#681819] bg-[#681819]'
                          : 'border-gray-300'
                      }`}
                    >
                      {isSelected && (
                        <span className='h-2 w-2 rounded-full bg-white' />
                      )}
                    </span>
                    {eventName}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {validationErrors.event && (
          <span className='text-sm text-red-500'>{validationErrors.event}</span>
        )}
      </div>

      {/* Rating Field */}
      <div className='flex flex-col gap-1.5'>
        <label className='text-sm font-semibold text-gray-700'>
          Pilih Rating <span className='text-red-500'>*</span>
        </label>
        <div className='grid grid-cols-5 gap-2'>
          {EMOJI_RATINGS.map(({ value, emoji, label }) => {
            const config = RATING_CONFIG[value];
            const isSelected = formData.rating === value;

            return (
              <button
                key={value}
                type='button'
                onClick={() => handleRatingChange(value)}
                className={`flex flex-col items-center gap-1.5 rounded-lg border-2 px-2 py-3 transition-all hover:scale-105 ${
                  isSelected
                    ? 'shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{
                  borderColor: isSelected ? config.color : undefined,
                  backgroundColor: isSelected ? config.bgColor : undefined,
                }}
                title={label}
              >
                <span className='text-3xl'>{emoji}</span>
                <span className='text-xs text-gray-600'>{label}</span>
              </button>
            );
          })}
        </div>
        {validationErrors.rating && (
          <span className='text-sm text-red-500'>
            {validationErrors.rating}
          </span>
        )}
      </div>

      {/* Message Field */}
      <div className='flex flex-col gap-1.5'>
        <div className='flex items-center justify-between'>
          <label
            htmlFor='message'
            className='text-sm font-semibold text-gray-700'
          >
            Pesan Anda <span className='text-red-500'>*</span>
          </label>
          <span
            className={`text-xs font-medium ${
              messagePercentage > 80 ? 'text-amber-500' : 'text-gray-500'
            }`}
          >
            {messageLength} / {maxMessageLength}
          </span>
        </div>
        <textarea
          id='message'
          value={formData.message}
          onChange={handleMessageChange}
          placeholder='Bagikan feedback Anda tentang layanan kami...'
          rows={5}
          className={`w-full resize-none rounded-lg border px-4 py-3 text-gray-900 transition-all focus:outline-none focus:ring-2 ${
            validationErrors.message
              ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-primary-100 focus:ring-primary-100/20'
          }`}
        />
        {/* Progress Bar */}
        <div className='h-1 w-full overflow-hidden rounded-full bg-gray-200'>
          <div
            className='h-full transition-all duration-200'
            style={{
              width: `${messagePercentage}%`,
              backgroundColor: messagePercentage > 90 ? '#DC2626' : '#3B82F6',
            }}
          />
        </div>
        {validationErrors.message && (
          <span className='text-sm text-red-500'>
            {validationErrors.message}
          </span>
        )}
      </div>

      {/* Error Alert */}
      {apiError && (
        <div className='rounded-lg border-l-4 border-red-500 bg-red-50 px-4 py-3'>
          <Typography variant='body' className='text-sm text-red-700'>
            <strong>Error:</strong> {apiError.message}
          </Typography>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type='submit'
        variant='primary'
        isLoading={loading}
        className='w-full'
      >
        Kirim Feedback
      </Button>
    </form>
  );
}
