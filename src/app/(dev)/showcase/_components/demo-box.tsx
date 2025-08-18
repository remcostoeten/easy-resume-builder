'use client';

import React from 'react';

type TProps = {
  label: string;
  className?: string;
};

export function DemoBox({ label, className }: TProps) {
  return (
    <div className={`h-24 w-40 rounded-md border flex items-center justify-center ${className ?? ''}`}>
      {label}
    </div>
  );
}
