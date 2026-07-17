import { Router } from 'express';
import * as postController from '../controllers/postController';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createPostRules, feedQueryRules } from '../validators/postValidators';

const router = Router();

router.post('/', requireAuth, createPostRules, validate, postController.create);
router.get('/',  requireAuth, feedQueryRules,  validate, postController.feed);
import * as interactionController from '../controllers/interactionController';
import { uuidParamRule } from '../validators/postValidators';

router.post('/:id/like',
  requireAuth, uuidParamRule, validate,
  interactionController.like);

router.post('/:id/comment',
  requireAuth, uuidParamRule, createPostRules, validate,
  interactionController.comment);

export default router;
