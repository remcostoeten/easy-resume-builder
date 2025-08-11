'use client';

type TProps = {
	status?: 'idle' | 'saving' | 'saved' | 'error';
	className?: string;
};

export function AutoSaveIndicator({ status = 'idle', className }: TProps) {
	const label =
		status === 'saving'
			? 'Saving…'
			: status === 'saved'
				? 'Saved'
				: status === 'error'
					? 'Error'
					: '';

	if (!label) return null;

	return (
		<span className={className} aria-live='polite'>
			{label}
		</span>
	);
}
