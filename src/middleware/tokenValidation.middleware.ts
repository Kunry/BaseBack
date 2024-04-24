import { Request, Response, NextFunction } from 'express';

import { AuthorizationError } from '@errors/authorization.error';
import { validateToken } from '../utils/jwt.util';
import { findBlackListToken } from '../repository/blacklist.repository';

export const tokenValidation = async (req: Request, _res: Response, next: NextFunction) => {
	try {
		const token = req.headers.authorization;
		if (!token) {
			throw new AuthorizationError('No token provided, authorization denied.');
		}
		try {
			if (typeof token !== 'string') {
				throw new AuthorizationError('Invalid token');
			}

			const isTokenBlackList = await findBlackListToken(token);

			if (isTokenBlackList) {
				throw new AuthorizationError('Invalid token');
			}

			const decoded = validateToken(token);
			req.user = decoded;
			next();
		} catch (error) {
			throw new AuthorizationError('Invalid token');
		}
	} catch (error) {
		next(error);
	}
};
