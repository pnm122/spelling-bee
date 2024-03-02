import express from 'express';


import user from './user'
import daily_puzzle from './daily_puzzle'
import getDb from '../db/conn';
import { SuccessResponse } from '../interfaces/Response';

const router = express.Router();

router.get<{}, SuccessResponse>('/', async (req, res) => {
  const db = await getDb()

  console.log(await db.collection('Puzzles').find().toArray())

  res.json({
    success: true,
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/user', user)
router.use('/daily_puzzle', daily_puzzle)

export default router;
