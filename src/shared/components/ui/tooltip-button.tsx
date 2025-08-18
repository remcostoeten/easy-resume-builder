'use client';

import type { ReactNode } from 'react';

import { Button } from './button';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

type TProps = {
  label: string;
  onClick?: () => void;
  children?: ReactNode;
};

export function TooltipButton({ label, onClick, children }: TProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button onClick={onClick}>{label}</Button>
      </TooltipTrigger>
      <TooltipContent>{children}</TooltipContent>
    </Tooltip>
  );
}
