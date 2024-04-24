/* eslint-disable @typescript-eslint/no-explicit-any */
import { IComment, IRestaurant } from '@interfaces/models/restaurant.interface';
import { RestaurantModel } from '../model/restaurant.model';
import { Types } from 'mongoose';

export const createRestaurantRepository = (userId: string, restaurant: any) => {
	return RestaurantModel.create({ ...restaurant, owner: userId });
};

export const updateRestaurantRepository = (
	userId: string,
	restaurantId: string,
	restaurant: Partial<IRestaurant>
) => {
	return RestaurantModel.findOneAndUpdate(
		{ _id: restaurantId, owner: userId },
		{ ...restaurant },
		{ new: true }
	).lean();
};

export const getRestaurantById = async (restaurantId: string) => {
	const restaurant = RestaurantModel.findById(restaurantId)
		.populate('owner', 'name -_id')
		.populate('reviews.owner', 'name -_id')
		.select('-updatedAt')
		.lean()
		.exec();
	const rating = RestaurantModel.aggregate([
		{ $match: { _id: new Types.ObjectId(restaurantId) } },
		{ $unwind: '$reviews' },
		{ $group: { _id: null, avgRating: { $avg: '$reviews.rating' } } }
	]).exec();

	return await Promise.all([restaurant, rating]).then(([restaurant, rating]) => {
		return { ...restaurant, avgRating: rating[0]?.avgRating || 0 };
	});
};

export const getRestaurantList = async (page: number, limit: number) => {
	const restaurants = await RestaurantModel.find()
		.skip((page - 1) * limit)
		.limit(limit)
		.lean()
		.exec();
	const total = await RestaurantModel.countDocuments().exec();
	const rating = await RestaurantModel.aggregate([
		{
			$match: {
				_id: { $in: restaurants.map((restaurant: any) => restaurant._id) }
			}
		},
		{ $unwind: '$reviews' },
		{
			$group: {
				_id: '$_id',
				avgRating: { $avg: '$reviews.rating' }
			}
		}
	]).exec();

	const restaurantList = restaurants.map((restaurant: any) => {
		const avgRating = rating.find((r: any) => r._id.equals(restaurant._id));
		return { ...restaurant, avgRating: avgRating?.avgRating || 0 };
	});

	return { restaurantList, total };
};

export const updateRestaurant = (
	userId: string,
	restaurantId: string,
	restaurant: Partial<IRestaurant>
) => {
	return RestaurantModel.findOneAndUpdate(
		{ _id: restaurantId, owner: userId },
		{ ...restaurant },
		{ new: true }
	).exec();
};

export const deleteRestaurantRepository = (userId: string, restaurantId: string) => {
	return RestaurantModel.findOneAndDelete({ _id: restaurantId, owner: userId }).exec();
};

export const addComment = (userId: string, restaurantId: string, comment: IComment) => {
	return RestaurantModel.findOneAndUpdate(
		{ _id: restaurantId },
		{ $push: { reviews: { ...comment, owner: userId } } },
		{ new: true }
	);
};

export const updateReview = (
	userId: string,
	restaurantId: string,
	commentId: string,
	comment: IComment
) => {
	const set = Object.keys(comment).reduce((acc, key) => {
		acc[`reviews.$[elem].${key}`] = comment[key as keyof IComment];
		return acc;
	}, {} as any);
	return RestaurantModel.updateOne(
		{ _id: restaurantId, 'reviews._id': commentId, 'reviews.owner': userId },
		{
			$set: set
		},
		{ arrayFilters: [{ 'elem._id': commentId, 'elem.owner': userId }], upsert: true }
	).exec();
};

export const deleteReview = (userId: string, restaurantId: string, commentId: string) => {
	return RestaurantModel.findOneAndUpdate(
		{ _id: restaurantId, 'reviews._id': commentId, 'reviews.owner': userId },
		{ $pull: { reviews: { _id: commentId } } },
		{ new: true }
	).exec();
};

export const listRestaurant = async (page: number, limit: number) => {
	const restaurants = await RestaurantModel.find()
		.skip((page - 1) * limit)
		.limit(limit)
		.exec();

	return restaurants;
};
