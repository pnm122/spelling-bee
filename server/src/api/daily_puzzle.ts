import express from 'express';
import Puzzle from '../interfaces/Puzzle';
import getDb from '../db/conn';
import getTodaysDate from '../utils/getTodaysDate';
import { ErrorResponse } from '../interfaces/Response';

const router = express.Router();

router.get<{}, Puzzle | ErrorResponse>('/', async (req, res) => {
  const db = await getDb()

  const dateString = getTodaysDate()
  console.log(dateString)

  const p = await db.collection('Puzzles').findOne({
    date: dateString
  })

  if(p) res.json(p as Puzzle);
  else  res.json({
    success: false,
    message: 'no-puzzle'
  })
});

export default router;