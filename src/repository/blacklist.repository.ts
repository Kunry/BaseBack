import { IBlackListToken } from '@interfaces/models/token.interface';
import { BlackListModel } from '../model/black_list.model';

export const findBlackListToken = async (token: string): Promise<IBlackListToken | null> => {
	const blackListToken = await BlackListModel.findOne({ token }).exec();

	return blackListToken;
};

export const addBlackListToken = async (token: string): Promise<IBlackListToken> => {
	const blackListToken = await BlackListModel.create({ token });

	return blackListToken;
};
