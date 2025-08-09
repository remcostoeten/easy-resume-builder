'use client';

import dynamic from 'next/dynamic';

const Inner = dynamic(() => import('./animated-activity-count').then(m => m.AnimatedActivityCount), { ssr: false });

type TProps = {
  count: number;
  delay?: number;
};

export function AnimatedActivityCountClient(props: TProps) {
  return <Inner {...props} />;
}
