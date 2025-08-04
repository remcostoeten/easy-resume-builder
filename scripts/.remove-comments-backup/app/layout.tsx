import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type React from 'react';

import './globals.css';

import { AppProvider } from '@/components/providers/app-provider';
import { siteConfig } from '@/core/config/site-config';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const metadata: Metadata = {
	title: siteConfig.name,
	description: siteConfig.description,
	generator: 'easy-resume-builder.com',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' className={inter.variable}>
			<body className='font-sans antialiased'>
				<AppProvider>{children}</AppProvider>
			</body>
		</html>
	);
}
