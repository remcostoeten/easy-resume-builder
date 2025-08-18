'use client';

import { useEffect } from 'react';
import { useViewTransitionStyle } from '../contexts/view-transition-style';

export function VTStyleMount() {
  const [style] = useViewTransitionStyle();

  useEffect(function sync() {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.dataset.vtStyle = style;
  }, [style]);

  return null;
}

