import { Router } from 'express';
import * as authController from '../controllers/authController';
import { signupRules, loginRules } from '../validators/authValidators';
import { validate } from '../middleware/validate';


const router = Router();

router.post('/signup', signupRules, validate, authController.signup);
router.post('/login',  loginRules,  validate, authController.login);

export default router;
