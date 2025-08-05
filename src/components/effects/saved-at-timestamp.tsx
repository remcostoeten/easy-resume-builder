'use client';

import { useEffect, useState } from 'react';
import { AnimatedTimeAgo } from './animated-time-ago';

type TProps = {
	className?: string;
};

export function SavedAtTimestamp({ className = '' }: TProps) {
const lastSavedAt: Date | null = null;
	const [timeSince, setTimeSince] = useState<number>(0);
	const [previousTime, setPreviousTime] = useState<number>(0);

	useEffect(function() {
		if (!lastSavedAt) return;

		function updateTimeSince() {
			if (!lastSavedAt) return;
			const now = new Date();
			const diffMs = now.getTime() - lastSavedAt.getTime();
			const diffSeconds = Math.floor(diffMs / 1000);

			if (diffSeconds !== timeSince) {
				setPreviousTime(timeSince);
				setTimeSince(diffSeconds);
			}
		}

		updateTimeSince();
		const interval = setInterval(updateTimeSince, 1000);

		return function() { return clearInterval(interval); };
	}, [lastSavedAt, timeSince]);

	function _formatTimeAgo(seconds: number) {
		if (seconds < 60) return `${seconds}s ago`;
		if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
		if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
		return `${Math.floor(seconds / 86400)}d ago`;
	}

	if (!lastSavedAt) {
		return <div className={`text-sm text-gray-500 ${className}`}>Not saved yet</div>;
	}

	const _diff = timeSince - previousTime;

	return (
		<AnimatedTimeAgo
			seconds={timeSince}
			className={`text-sm text-muted-foreground ${className}`}
		/>
	);
}
