function getBaseUrl(): string {
	if (typeof window !== 'undefined') {
		return window.location.origin;
	}
	
	if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) {
		return process.env.NEXT_PUBLIC_API_URL;
	}
	
	return '';
}

export { getBaseUrl };
