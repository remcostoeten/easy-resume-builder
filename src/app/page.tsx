'use client';

import { ClientWrapper } from '@/components/client-wrapper';
import { HomeView } from '../views/home-view';

export default function Page() {
	return (
		<ClientWrapper>
			<div className='animated-bg'>
				{Array.from({ length: 20 }).map((_, i) => (
					<div key={i} className='dot' />
				))}
			</div>
			<HomeView />
		</ClientWrapper>
	);
}
