import { BaseError } from '@errors/base.error';
import { addFavRestaurant, getUserById } from '../repository/user.repository';

export const addFavoriteRestaurant = async (userId: string, restaurantId: string) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new BaseError('User not found', 404);
	}
	await addFavRestaurant(userId, restaurantId);
};
