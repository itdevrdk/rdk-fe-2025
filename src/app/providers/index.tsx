'use client';

import * as React from 'react';

import Toast from '@/components/Toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toast />
      {children}
    </>
  );
}
