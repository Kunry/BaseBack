import { IBlackListToken } from '@interfaces/models/token.interface';
import { Schema, model } from 'mongoose';

const BlackListTokenSchema = new Schema<IBlackListToken>(
	{
		token: {
			type: String,
			trim: true,
			required: true,
			unique: true
		}
	},
	{
		timestamps: true,
		versionKey: false
	}
);

BlackListTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

export const BlackListModel = model<IBlackListToken>('black_list', BlackListTokenSchema);
