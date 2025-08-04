import { format } from 'date-fns';
import type { TDateRange } from '../types/resume';

export function formatDateRange(dateRange: TDateRange): string {
	const { startDate, endDate, isCurrentPosition, dateFormat } = dateRange;

	function formatSingleDate(date: Date): string {
		switch (dateFormat) {
			case 'year':
				return format(date, 'yyyy');
			case 'month-year':
				return format(date, 'MMM yyyy');
			case 'full-date':
				return format(date, 'MMM dd, yyyy');
			default:
				return format(date, 'MMM yyyy');
		}
	}

	const startFormatted = formatSingleDate(startDate);

	if (isCurrentPosition) {
		return `${startFormatted} - Present`;
	}

	if (!endDate) {
		return startFormatted;
	}

	const endFormatted = formatSingleDate(endDate);
	return `${startFormatted} - ${endFormatted}`;
}

export function calculateDuration(dateRange: TDateRange): string {
	const { startDate, endDate, isCurrentPosition } = dateRange;
	const end = isCurrentPosition ? new Date() : endDate || new Date();

	const diffInMonths =
		(end.getFullYear() - startDate.getFullYear()) * 12 +
		(end.getMonth() - startDate.getMonth());

	if (diffInMonths < 1) {
		return 'Less than 1 month';
	}

	const years = Math.floor(diffInMonths / 12);
	const months = diffInMonths % 12;

	if (years === 0) {
		return `${months} month${months !== 1 ? 's' : ''}`;
	}

	if (months === 0) {
		return `${years} year${years !== 1 ? 's' : ''}`;
	}

	return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
}
