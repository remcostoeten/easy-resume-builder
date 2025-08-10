'use client';

type TProps = {
	lastLoginTime: Date | null;
	createdAt: Date;
};

function parseRelativeTime(date: Date | null): {
	value: number;
	unit: 'm' | 'h' | 'd' | 's' | 'literal';
	label: string;
} {
	if (!date) return { value: 0, unit: 'literal', label: 'Never' };

	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();
	const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
	const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	if (diffInMinutes <= 1) {
		return { value: 0, unit: 'literal', label: 'Just now' };
	}

	if (diffInMinutes < 60) {
		return { value: diffInMinutes, unit: 'm', label: 'minutes ago' };
	}

	if (diffInHours < 24) {
		return { value: diffInHours, unit: 'h', label: 'hours ago' };
	}

	if (diffInDays === 1) {
		return { value: 1, unit: 'literal', label: 'Yesterday' };
	}

	if (diffInDays < 7) {
		return { value: diffInDays, unit: 'd', label: 'days ago' };
	}

	return { value: 0, unit: 'literal', label: date.toLocaleDateString() };
}

function splitLocaleDate(date: Date): { day: number; monthLabel: string; year: number } {
	const monthLabel = date.toLocaleDateString('en-US', { month: 'long' });
	const day = date.getDate();
	const year = date.getFullYear();

	return { day, monthLabel, year };
}

export function ProfileStats({ lastLoginTime, createdAt }: TProps) {
	const relative = parseRelativeTime(lastLoginTime);
	const { day, monthLabel, year } = splitLocaleDate(createdAt);

	return (
		<dl className='grid grid-cols-1 md:grid-cols-2 gap-8'>
			<div>
				<dt className='text-sm font-medium text-muted-foreground mb-2'>Last Login</dt>
				<dd className='text-base'>
					{relative.unit === 'literal' ? (
						relative.label
					) : (
						<>
							span className='font-mono'{relative.value}/span {relative.label}
						</>
					)}
				</dd>
			</div>

			<div>
				<dt className='text-sm font-medium text-muted-foreground mb-2'>Member Since</dt>
				<dd className='text-base'>
					span className='font-mono'{day}/span {monthLabel} span className='font-mono
					inline-block'{year}/span
				</dd>
			</div>
		</dl>
	);
}
