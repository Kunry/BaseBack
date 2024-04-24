import { BaseError } from '@errors/base.error';
import { IUser } from '@interfaces/models/user.interface';
import { createUser, getUserById, getUserWithPassword } from '../repository/user.repository';
import { createRefreshToken, createToken, validateToken } from '../utils/jwt.util';
import { addBlackListToken, findBlackListToken } from '../repository/blacklist.repository';

const login = async (email: string, password: string) => {
	const user = await getUserWithPassword(email);

	if (!user) {
		throw new BaseError('User not found', 404);
	}

	const isPasswordMatch = await user.checkPassword(password);
	if (!isPasswordMatch) {
		throw new BaseError('Invalid password', 400);
	}

	const userToken = { _id: user._id, email: user.email };

	const token = createToken(userToken);
	const refreshToken = createRefreshToken(userToken);

	return {
		user: user.toJSON<Omit<IUser, 'password'>>({ virtuals: false, versionKey: false }),
		token,
		refreshToken
	};
};

const refreshToken = async (refreshToken: string) => {
	const findRefreshToken = await findBlackListToken(refreshToken);

	if (findRefreshToken) {
		throw new BaseError('Invalid refresh token', 400);
	}
	const userValidate = validateToken(refreshToken);

	const user = await getUserById(userValidate._id);

	if (!user) {
		throw new BaseError('User not found', 404);
	}

	const userToken = { _id: userValidate._id, email: userValidate.email };

	const token = createToken(userToken);
	const newRefreshToken = createRefreshToken(userToken);

	await addBlackListToken(refreshToken);
	return {
		user,
		token,
		refreshToken: newRefreshToken
	};
};

const logout = async (refreshToken: string, token: string) => {
	validateToken(refreshToken);

	await addBlackListToken(refreshToken);
	await addBlackListToken(token);
};

const signUp = async (email: string, password: string, name: string) => {
	const user = await getUserWithPassword(email);

	if (user) {
		throw new BaseError('User already exists', 400);
	}

	const newUser = await createUser(email, password, name);

	return newUser.toJSON<Omit<IUser, 'password'>>({ virtuals: true, versionKey: false });
};

const verifyToken = async (token: string) => {
	const userValidate = validateToken(token);

	const user = await getUserById(userValidate._id);

	if (!user) {
		throw new BaseError('User not found', 404);
	}

	return user;
};

export default {
	login,
	refreshToken,
	logout,
	signUp,
	verifyToken
};
