/**
 * RTL Wrapper component - ensures proper RTL rendering
 */

'use client';

import { ReactNode, MouseEventHandler } from 'react';

interface RTLWrapperProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export function RTLWrapper({ children, className = '', onClick }: RTLWrapperProps) {
  return (
    <div dir="rtl" lang="ar" className={className} onClick={onClick}>
      {children}
    </div>
  );
}
