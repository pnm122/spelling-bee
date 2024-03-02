import express from "express";
import bcrypt from 'bcrypt'
import { LoginRequest } from "../../interfaces/User";
import { ErrorResponse, SuccessResponse } from "../../interfaces/Response";
import getDb from "../../db/conn";
import User from "../../db/interfaces/User";

const router = express.Router()

router.post<LoginRequest, ErrorResponse | SuccessResponse | User>('/', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  if(!username || !password) {
    res.json({
      success: false,
      message: 'user-info-not-provided'
    })
    return
  }

  try {
    const db = await getDb()
    const user = await db.collection('Users').findOne({
      username: username
    }) as unknown as User | undefined

    if(!user) {
      res.json({
        success: false,
        message: 'user-info-incorrect'
      })
      return
    }

    const match = await bcrypt.compare(password, user.password)

    if(match) {
      res.json({
        success: true,
        message: 'Logged in successfully!'
      })
    } else {
      res.json({
        success: false,
        message: 'user-info-incorrect'
      })
    }
  } catch(e) {
    res.json({
      success: false,
      message: 'unknown-error'
    })
  }
})

export default router