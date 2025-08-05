import type React from 'react';
import './globals.css';

import { Providers } from '../components/providers/providers';
import { poppins } from '../core/config/fonts/poppins';
import { metadata } from '../core/config/metadata-home';
import { cn } from '../shared/utilities/cn';

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang='en'
			suppressHydrationWarning
			className={cn(
				'dark',
				poppins.variable
				// , lora.variable, nunito.variable
			)}
		>
			<body className='font-sans antialiased bg-background text-foreground'>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
