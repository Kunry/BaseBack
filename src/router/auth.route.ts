import { Router } from 'express';
import { Login, Logout, RefreshToken, SignUp, VerifyToken } from '../controllers/auth.controller';
import { tokenValidation } from '../middleware/tokenValidation.middleware';

const router = Router();

router.get('/refresh-token', RefreshToken);
router.get('/logout', tokenValidation, Logout);
router.get('/verify', tokenValidation, VerifyToken);

router.post('/login', Login);
router.post('/signup', SignUp);

export const authRoute = { path: '/auth', router };
