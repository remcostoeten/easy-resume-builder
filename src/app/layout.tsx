import type React from 'react';
import './globals.css';
import '../styles/theme.css';

import { Providers } from '../components/providers/providers';
import { nunito } from '../core/config/fonts';
import { metadata } from '../core/config/metadata-home';
import { cn } from '../shared/utilities/cn';
import { AdminDevRouteNav } from '../components/dev/admin-dev-route-nav';
import { RouteTransitionMount } from '../components/route-transition-mount';
import { ViewTransitionStyleProvider } from '../shared/contexts/view-transition-style';
import { VTStyleMount } from '../shared/components/vt-style-mount';
import { Toaster } from 'sonner';

export { metadata };

export default function RootLayout({ children }: TChildren) {
	return (
		<html lang='en' suppressHydrationWarning className={cn(nunito.variable)}>
			<body className='font-sans antialiased bg-background text-foreground'>
				<Providers>
					<ViewTransitionStyleProvider>
						<RouteTransitionMount />
						<VTStyleMount />
						{children}
						<AdminDevRouteNav />
					</ViewTransitionStyleProvider>
				</Providers>
				<Toaster />
			</body>
		</html>
	);
}
