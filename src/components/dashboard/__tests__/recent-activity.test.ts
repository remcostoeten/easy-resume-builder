import { describe, expect, it } from 'vitest';

function formatTimestamp(timestamp: Date, locale: string) {
	const formatter = new Intl.DateTimeFormat(locale, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
	return formatter.format(timestamp);
}

function getRelativeTimeString(timestamp: Date, locale: string) {
	const now = new Date();
	const diffInMs = now.getTime() - timestamp.getTime();
	const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
	const diffInDays = Math.floor(diffInHours / 24);

	if (diffInHours < 1) {
		return 'Just now';
	} else if (diffInHours < 24) {
		const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
		return formatter.format(-diffInHours, 'hour');
	} else if (diffInDays < 7) {
		const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
		return formatter.format(-diffInDays, 'day');
	} else {
		return formatTimestamp(timestamp, locale);
	}
}

describe('RecentActivity date formatting', () => {
	it('should format timestamps using locale-aware DateTimeFormat', () => {
		const testDate = new Date('2024-01-15T14:30:00Z');

		const usFormat = formatTimestamp(testDate, 'en-US');
		const gbFormat = formatTimestamp(testDate, 'en-GB');

		expect(usFormat).toContain('Jan');
		expect(usFormat).toContain('15');
		expect(usFormat).toContain('2024');

		expect(gbFormat).toContain('Jan');
		expect(gbFormat).toContain('15');
		expect(gbFormat).toContain('2024');
	});

	it('should return "Just now" for recent timestamps', () => {
		const recentTimestamp = new Date(Date.now() - 30 * 60 * 1000);
		const result = getRelativeTimeString(recentTimestamp, 'en-US');
		expect(result).toBe('Just now');
	});

	it('should use relative time format for timestamps within 24 hours', () => {
		const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
		const result = getRelativeTimeString(oneHourAgo, 'en-US');
		expect(result).toContain('hour');
	});

	it('should use relative time format for timestamps within a week', () => {
		const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
		const result = getRelativeTimeString(twoDaysAgo, 'en-US');
		expect(result).toContain('day');
	});

	it('should fall back to formatted timestamp for older dates', () => {
		const oldTimestamp = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
		const result = getRelativeTimeString(oldTimestamp, 'en-US');

		expect(result).not.toContain('day');
		expect(result).not.toContain('hour');
	});
});
