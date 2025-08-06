type TSafeUser = {
	id: string;
	email: string;
	emailVerified: boolean;
	name: string;
	createdAt: Date;
	updatedAt: Date;
	image?: string | null;
};

type TAuthSuccess<T = unknown> = {
	success: true;
	data: T;
	error: null;
};

type TAuthError = {
	success: false;
	data: null;
	error: {
		message: string;
		code?: string;
	};
};

export type TAuthResult<T = unknown> = TAuthSuccess<T> | TAuthError;

export type TSignUpEmailData = {
	user: TSafeUser;
	session: {
		id: string;
		userId: string;
		expiresAt: Date;
	};
};

export type TSignInEmailData = {
	user: TSafeUser;
	session: {
		id: string;
		userId: string;
		expiresAt: Date;
	};
};

export type TSignOutData = {
	success: true;
};

export type TLinkOAuthAccountData = {
	user: TSafeUser;
	account: {
		id: string;
		userId: string;
		providerId: string;
		accountId: string;
	};
};
