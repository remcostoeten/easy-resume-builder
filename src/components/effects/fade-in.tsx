'use client';

import type { UseInViewOptions } from 'framer-motion';

type MarginType = UseInViewOptions['margin'];

interface BlurFadeProps {
	children: React.ReactNode;
	className?: string;
	variant?: {
		hidden: { y: number };
		visible: { y: number };
	};
	duration?: number;
	delay?: number;
	yOffset?: number;
	inView?: boolean;
	inViewMargin?: MarginType;
	blur?: string;
}

export function BlurFade({ children, className }: BlurFadeProps) {
	return <div className={className}>{children}</div>;
}
