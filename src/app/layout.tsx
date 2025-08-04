import type React from 'react';
import './globals.css';

import { Providers } from '../components/providers/providers';
import { poppins } from '../core/config/fonts/poppins';
import { cn } from '../shared/utilities/cn';
import { metadata } from '../core/config/metadata-home';

export { metadata };

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' className={cn(poppins.variable /* , lora.variable , nunito.variable */)}>
			<body className='font-sans antialiased'>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
