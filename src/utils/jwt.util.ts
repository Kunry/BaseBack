import jwt from 'jsonwebtoken';
import { IReqUser } from '@interfaces/models.interface';
import { SECRET_KEY } from '@constants/env.constants';

export const createToken = (user: IReqUser): string => {
	return jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
};

export const createRefreshToken = (user: IReqUser): string => {
	return jwt.sign(user, SECRET_KEY, { expiresIn: '7d' });
};

export const validateToken = (token: string): IReqUser => {
	return jwt.verify(token, SECRET_KEY) as IReqUser;
};

export const cleanBearerToken = (token: string): string => {
	return token.replace('Bearer ', '');
};
