'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useState } from 'react';

type TSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function SaveStatusIndicator() {
	const [status, _setStatus] = useState<TSaveStatus>('idle');

	function getStatusText(status: string) {
		switch (status) {
			case 'idle':
				return 'Ready';
			case 'saving':
				return 'Saving...';
			case 'saved':
				return 'Saved';
			case 'error':
				return 'Error saving';
			default:
				return 'Unknown';
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'idle':
				return 'text-gray-500';
			case 'saving':
				return 'text-blue-500';
			case 'saved':
				return 'text-green-500';
			case 'error':
				return 'text-red-500';
			default:
				return 'text-gray-500';
		}
	}

	return (
		<div className='flex flex-col gap-3'>
			<div className='flex items-center gap-2'>
				<AnimatePresence mode='wait'>
					{status === 'saved' ? (
						<motion.div
							key={`saved-${Date.now()}`}
							initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
							animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
							exit={{ opacity: 0, y: -6, filter: 'blur(6px)' }}
							transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
							className='flex items-center gap-1'
						>
							<Check className='w-4 h-4 text-green-500' />
							<span className={`text-sm ${getStatusColor(status)}`}>
								{getStatusText(status)}
							</span>
						</motion.div>
					) : (
						<motion.span
							key={`status-${status}`}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className={`text-sm ${getStatusColor(status)}`}
						>
							{getStatusText(status)}
						</motion.span>
					)}
				</AnimatePresence>
				<button
					type='button'
					disabled
					className='px-2 py-1 text-xs bg-gray-500 text-white rounded transition-colors'
				>
					Save Now
				</button>
			</div>
		</div>
	);
}
