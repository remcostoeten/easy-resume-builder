"use client";

import { useRouteTransition } from '@/shared/hooks/use-route-transition';

export function RouteTransitionMount() {
  useRouteTransition();
  return null;
}

