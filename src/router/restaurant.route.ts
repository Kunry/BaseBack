import { Router } from 'express';
import { multerMiddleware } from '../middleware/multer.middleware';
import {
	CreateComment,
	CreateRestaurant,
	DeleteComment,
	DeleteRestaurant,
	GetRestaurant,
	ListRestaurant,
	UpdateComment,
	UpdateRestaurant
} from '@controllers/restaurant.controller';
import { tokenValidation } from '../middleware/tokenValidation.middleware';

const router = Router();

router.get('/list', ListRestaurant);

router.get('/detail/:id', GetRestaurant);

router.post('/create', tokenValidation, multerMiddleware.single('image'), CreateRestaurant);

router.put('/:id', tokenValidation, multerMiddleware.single('image'), UpdateRestaurant);

router.delete('/:id', tokenValidation, DeleteRestaurant);

router.post('/:id/comment', tokenValidation, CreateComment);

router.put('/:id/comment/:commentId', tokenValidation, UpdateComment);

router.delete('/:id/comment/:commentId', tokenValidation, DeleteComment);

export const RestaurnatRoute = { path: '/restaurant', router };
