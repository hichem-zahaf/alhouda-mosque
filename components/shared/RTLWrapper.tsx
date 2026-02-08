/**
 * RTL Wrapper component - ensures proper RTL rendering
 */

'use client';

import { ReactNode } from 'react';

interface RTLWrapperProps {
  children: ReactNode;
  className?: string;
}

export function RTLWrapper({ children, className = '' }: RTLWrapperProps) {
  return (
    <div dir="rtl" lang="ar" className={className}>
      {children}
    </div>
  );
}
