import type React from 'react';
import './globals.css';

import { Providers } from '../components/providers/providers';
import { nunito } from '../core/config/fonts';
import { metadata } from '../core/config/metadata-home';
import { cn } from '../shared/utilities/cn';
import { AdminDevRouteNav } from '../components/dev/admin-dev-route-nav';

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning className={cn('dark', nunito.variable)}>
			<body className='dark font-sans antialiased bg-background text-foreground'>
				<Providers>
					{children}
					<AdminDevRouteNav />
				</Providers>
			</body>
		</html>
	);
}
