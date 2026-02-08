/**
 * Temperature component
 */

'use client';

import { Thermometer } from 'lucide-react';
import { useTemperature } from '@/hooks/use-temperature';

interface TemperatureProps {
  className?: string;
}

export function Temperature({ className = '' }: TemperatureProps) {
  const { temperature, condition } = useTemperature();

  if (!temperature) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Thermometer className="w-5 h-5 text-primary" />
      <div className="text-lg font-semibold text-primary">
        {temperature}
      </div>
      {condition && (
        <div className="text-sm text-accent-d4">
          {condition}
        </div>
      )}
    </div>
  );
}
