'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface SimpleCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'auto';
  children?: React.ReactNode;
  autoSlideInterval?: number;
}

export default function SimpleCarousel({
  images,
  alt,
  className,
  aspectRatio = 'video',
  children,
  autoSlideInterval = 3000,
}: SimpleCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  React.useEffect(() => {
    if (!autoSlideInterval) return;
    const slideInterval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [autoSlideInterval, nextSlide]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className={className}>
      <div
        className={cn(
          'group relative w-full overflow-hidden rounded-2xl',
          aspectRatio === 'video' && 'aspect-[986/350]',
          aspectRatio === 'square' && 'aspect-square',
        )}
      >
        <div
          className='flex h-full w-full transition-transform duration-500 ease-out'
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <div key={index} className='relative h-full w-full flex-shrink-0'>
              <Image
                src={src}
                alt={`${alt} - Slide ${index + 1}`}
                width={986}
                height={350}
                className='h-full w-full object-cover'
              />
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <div className='absolute left-2 top-[50%] -translate-y-[-50%] rounded-full bg-black/20 p-2 text-white transition-colors duration-200 hover:bg-black/50 md:left-5 opacity-0 group-hover:opacity-100'>
          <button
            onClick={prevSlide}
            className='block'
            aria-label='Previous Slide'
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* Right Arrow */}
        <div className='absolute right-2 top-[50%] -translate-y-[-50%] rounded-full bg-black/20 p-2 text-white transition-colors duration-200 hover:bg-black/50 md:right-5 opacity-0 group-hover:opacity-100'>
          <button onClick={nextSlide} className='block' aria-label='Next Slide'>
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {children}

      {/* Dots */}
      <div className='flex justify-center gap-2 py-2 mt-2'>
        {images.map((_, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={cn(
              'h-2 w-2 cursor-pointer rounded-full transition-all duration-300',
              currentIndex === slideIndex
                ? 'bg-yellow-200 w-4'
                : 'bg-primary-200',
            )}
          ></div>
        ))}
      </div>
    </div>
  );
}
