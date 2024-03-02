import express from 'express';
import getDb from '../../db/conn';
import { ErrorResponse, SuccessResponse } from '../../interfaces/Response';
import bcrypt from 'bcrypt'

const router = express.Router();

router.post<{ username: string, password: string }, ErrorResponse | SuccessResponse>('/', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  if(!username || !password) {
    res.json({
      success: false,
      message: 'user-info-not-provided'
    })
    return
  }

  // Create encrypted password for database
  const saltRounds = parseInt(process.env.SALT_ROUNDS!)
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  try {
    const db = await getDb()
    await db.collection('Users').insertOne({
      username: username,
      password: hashedPassword
    })

    res.json({
      success: true,
      message: "User successfully added to database"
    })
  } catch(e) {
    res.json({
      success: false,
      message: 'unknown-error'
    })
  }
});

export default router;