import express from 'express';

import user from './user/_index'
import puzzle from './puzzle/_index'
import score from './score/_index'
import { SuccessResponse } from '../shared/interfaces/Response';

const router = express.Router();

router.get<{}, SuccessResponse>('/', async (req, res) => {
  res.json({
    success: true,
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/user', user)
router.use('/puzzle', puzzle)
router.use('/score', score)

export default router;
