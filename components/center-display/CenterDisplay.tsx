/**
 * Center Display component
 */

'use client';

import { Clock } from './Clock';
import { CountdownTimer } from './CountdownTimer';
import { QuoteDisplay } from './QuoteDisplay';

interface CenterDisplayProps {
  className?: string;
}

export function CenterDisplay({ className = '' }: CenterDisplayProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        gap-8 py-8
        ${className}
      `}
    >
      <Clock />
      <CountdownTimer />
      <QuoteDisplay />
    </div>
  );
}
