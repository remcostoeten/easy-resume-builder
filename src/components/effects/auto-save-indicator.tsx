'use client';

import { Check, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/shared/utilities/cn';

type TProps = {
	className?: string;
	showIcon?: boolean;
	variant?: 'full' | 'compact';
};

export function AutoSaveIndicator({
	className = '',
	showIcon = true,
	variant = 'full',
}: TProps) {
	const [secondsSinceLastSave, setSecondsSinceLastSave] = useState(0);
	const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
	const [showSavedMessage, setShowSavedMessage] = useState(false);

	function updateTimer() {
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - lastSaveTime!.getTime()) / 1000);
		setSecondsSinceLastSave(diffInSeconds);

		if (diffInSeconds > 3) {
			setShowSavedMessage(false);
		}
	}

	useEffect(function setupTimer() {
		if (!lastSaveTime) return;

		const interval = setInterval(updateTimer, 1000);

		function cleanup() {
			clearInterval(interval);
		}

		return cleanup;
	}, [lastSaveTime]);

	function handleStorageChange() {
		setLastSaveTime(new Date());
		setSecondsSinceLastSave(0);
		setShowSavedMessage(true);
	}

	useEffect(function setupStorageListeners() {
		window.addEventListener('storage', handleStorageChange);
		window.addEventListener('localStorageUpdate', handleStorageChange);

		function cleanup() {
			window.removeEventListener('storage', handleStorageChange);
			window.removeEventListener('localStorageUpdate', handleStorageChange);
		}

		return cleanup;
	}, []);

	function getTimeDisplay(seconds: number) {
		if (seconds < 60) {
			return { value: seconds, unit: 's', label: 'seconds' };
		}
		if (seconds < 3600) {
			const minutes = Math.floor(seconds / 60);
			return { value: minutes, unit: 'm', label: minutes === 1 ? 'minute' : 'minutes' };
		}
		if (seconds < 86400) {
			const hours = Math.floor(seconds / 3600);
			return { value: hours, unit: 'h', label: hours === 1 ? 'hour' : 'hours' };
		}
		const days = Math.floor(seconds / 86400);
	return { value: days, unit: 'd', label: days === 1 ? 'day' : 'days' };
	}

	const { value, unit } = getTimeDisplay(secondsSinceLastSave);

	if (showSavedMessage) {
		if (variant === 'compact') {
			return (
				<span className={cn('flex items-center gap-1 text-green-600', className)}>
					{showIcon && <Check className='h-3 w-3' />}
					<span className='text-xs'>Saved!</span>
				</span>
			);
		}
		return (
			<span className={cn('flex items-center gap-2 text-sm text-green-600', className)}>
				{showIcon && <Check className='h-4 w-4' />}
				<span>Saved!</span>
			</span>
		);
	}

	if (!lastSaveTime) {
		if (variant === 'compact') {
			return (
				<span className={cn('flex items-center gap-1 text-muted-foreground', className)}>
					{showIcon && <Save className='h-3 w-3' />}
					<span className='text-xs'>Ready</span>
				</span>
			);
		}
		return (
			<span
				className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}
			>
				{showIcon && <Save className='h-4 w-4' />}
				<span>Ready to save</span>
			</span>
		);
	}

	if (variant === 'compact') {
		return (
			<span className={cn('flex items-center gap-1 text-muted-foreground', className)}>
				{showIcon && <Save className='h-3 w-3' />}
				<span className='font-mono text-xs'>{value}</span>
				<span className='text-xs'>{unit} ago</span>
			</span>
		);
	}

	return (
		<span className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}>
			{showIcon && <Save className='h-4 w-4' />}
			<span>
				Auto-saved{' '}
				{secondsSinceLastSave === 0 ? (
					'just now'
				) : (
					<>
						<span className='font-mono font-medium'>{value}</span>
						<span className='ml-0.5'>saved {unit} ago</span>
					</>
				)}
			</span>
		</span>
	);
}
