'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function AnimatedBackground() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		function handleMouseMove(e: MouseEvent) {
			setMousePosition({ x: e.clientX, y: e.clientY });
		}

		window.addEventListener('mousemove', handleMouseMove);
		return () => window.removeEventListener('mousemove', handleMouseMove);
	}, []);

	return (
		<div className='fixed inset-0 overflow-hidden pointer-events-none'>
			<motion.div
				className='absolute inset-0 opacity-30'
				style={{
					background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
				}}
			/>

			<div className='absolute inset-0'>
				{Array.from({ length: 20 }).map((_, i) => (
					<motion.div
						key={i}
						className='absolute w-1 h-1 bg-blue-400/20 rounded-full'
						initial={{
							x: Math.random() * window.innerWidth,
							y: Math.random() * window.innerHeight,
						}}
						animate={{
							x: Math.random() * window.innerWidth,
							y: Math.random() * window.innerHeight,
						}}
						transition={{
							duration: Math.random() * 10 + 10,
							repeat: Number.POSITIVE_INFINITY,
							repeatType: 'reverse',
						}}
					/>
				))}
			</div>
		</div>
	);
}
