import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import IconButton from '@/components/buttons/IconButton';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-8 right-8 z-50 transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none',
      )}
    >
      <IconButton
        onClick={scrollToTop}
        variant='primary'
        className='rounded-full p-3 shadow-lg hover:shadow-xl bg-orange-851 text-white'
        icon={ArrowUp}
        aria-label='Scroll to top'
      />
    </div>
  );
}
