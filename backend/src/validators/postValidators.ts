import { body, query, param } from 'express-validator';

export const createPostRules = [
  body('text').isString().trim().isLength({ min: 1, max: 500 })
    .withMessage('Text must be 1–500 characters'),
];

export const feedQueryRules = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('username').optional().isString().trim(),
];

export const uuidParamRule = [
  param('id').isUUID().withMessage('Invalid post id'),
];
