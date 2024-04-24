import { NextFunction, Request, Response } from 'express';
import { IError } from '../interfaces';

export const errorHandler = (
	error: IError,
	_req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	_next: NextFunction
): void => {
	try {
		let status = error.status || 500;
		if (
			Object.keys(error)[0] === '_original' ||
			error.name === 'MongoError' ||
			error.name === 'MongoServerError' ||
			error.name === 'ValidationError'
		) {
			status = 400;
		}

		if (error.message.includes('E11000')) {
			error.message = 'Duplicated key';
			error.code = 'DuplicatedKeyError';
			status = 400;
		}

		error.message = error.message || 'Something went wrong';
		logger.error(error);
		const messageError = {
			message: error.message,
			status,
			code: error.code || error.name
		};

		res.status(status).json(messageError);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (err: any) {
		res.status(500).json({ message: err.message });
	}
};
