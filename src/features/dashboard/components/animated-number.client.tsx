'use client';

import dynamic from 'next/dynamic';

const Inner = dynamic(() => import('./animated-number'), { ssr: false });

type TProps = {
  value: number;
  className?: string;
  format?: {
    minimumIntegerDigits?: number;
    maximumFractionDigits?: number;
    notation?: 'compact' | 'standard';
    signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero';
    style?: 'decimal' | 'currency' | 'percent';
  };
  delay?: number;
  duration?: number;
};

export function AnimatedNumberClient(props: TProps) {
  return <Inner {...props} />;
}
