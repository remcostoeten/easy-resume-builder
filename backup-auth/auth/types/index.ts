export type TSession = {
	user: {
		id: string;
		email: string;
		emailVerified: boolean;
		name: string;
		createdAt: Date;
		updatedAt: Date;
		image?: string | null;
	};
	session: {
		id: string;
		userId: string;
		expiresAt: Date;
		createdAt: Date;
		updatedAt: Date;
		userAgent?: string | null;
		ipAddress?: string | null;
	};
};
