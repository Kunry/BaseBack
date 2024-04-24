import { IUserDocument } from '@interfaces/models/user.interface';
import { UserModel } from '../model/user.model';

export const getUserWithPassword = async (email: string): Promise<IUserDocument | null> => {
	const user = await UserModel.findOne({ email }, {}, {}).select('+password').exec();

	return user;
};

export const createUser = async (
	email: string,
	password: string,
	name: string
): Promise<IUserDocument> => {
	const user = await UserModel.create({ email, password, name });

	return user;
};

export const getUserById = async (userId: string): Promise<IUserDocument | null> => {
	const user = await UserModel.findById(userId).exec();

	return user;
};

export const addFavRestaurant = async (userId: string, restaurantId: string): Promise<void> => {
	await UserModel.findByIdAndUpdate(userId, { $addToSet: { favRestaurants: restaurantId } }).exec();
};

export const removeFavRestaurant = async (userId: string, restaurantId: string): Promise<void> => {
	await UserModel.findByIdAndUpdate(userId, {
		$pull: { favRestaurants: restaurantId }
	}).exec();
};
