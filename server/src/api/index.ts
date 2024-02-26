import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import getDb from '../db/conn';

const router = express.Router();

router.get<{}, MessageResponse>('/', async (req, res) => {
  const db = await getDb()

  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);

export default router;
