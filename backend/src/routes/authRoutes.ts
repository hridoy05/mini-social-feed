import { Router } from 'express';
import * as authController from '../controllers/authController';
import { signupRules, loginRules, updateFcmTokenRules } from '../validators/authValidators';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/signup', signupRules, validate, authController.signup);
router.post('/login',  loginRules,  validate, authController.login);
router.post('/fcm-token', requireAuth, updateFcmTokenRules, validate, authController.updateFcmToken);

export default router;
