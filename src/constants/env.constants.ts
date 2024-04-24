export const PORT = process.env.PORT || 3001;

export const DATABASEURL =
	(process.env.NODE_ENV === 'development'
		? process.env.DATABASEURL_DEV
		: process.env.DATABASEURL_PROD) || 'mongodb://127.0.0.1:27017/tailor_hub_technical_review';

export const IV_LENGTH = +process.env.IV_LENGTH;
export const KEY = process.env.KEY;
export const ALGORITHM = 'aes-256-cbc';

export const SECRET_KEY = process.env.SECRET_KEY || 'tailor_hub_technical_review';
