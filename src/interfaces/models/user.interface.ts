import { Document } from 'mongoose';
import { IRestaurantDocument } from './restaurant.interface';

export interface IUser {
	email: string;
	password: string;
	favRestaurants: IRestaurantDocument['_id'][];
	name: string;
}

export interface IUserDocument extends IUser, Document {
	checkPassword(password: string): Promise<boolean>;
}
