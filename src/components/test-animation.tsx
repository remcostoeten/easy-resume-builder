'use client';

import NumberFlow from '@number-flow/react';
import { useState } from 'react';

export function TestAnimation() {
	const [value, setValue] = useState(0);

	return (
		<div className='p-4 border rounded'>
			<h3>NumberFlow Test</h3>
			<div className='text-2xl font-mono my-4'>
				<NumberFlow value={value} />
			</div>
			<button
				onClick={() => setValue((v) => v + 1)}
				className='px-4 py-2 bg-blue-500 text-white rounded'
			>
				Increment: {value}
			</button>
		</div>
	);
}
