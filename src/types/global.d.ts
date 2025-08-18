import type { ReactNode } from 'react';

declare global {
  type TChildren = {
    children: ReactNode;
  };
}

export {}; 