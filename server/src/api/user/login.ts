import express from "express";
import { LoginRequest } from "../../interfaces/User";
import { ErrorResponse, SuccessResponse } from "../../interfaces/Response";
import { validateUserCredentials } from "../../db/utils/users";
import { createSession } from "../../db/utils/sessions";

const router = express.Router()

router.post<LoginRequest, ErrorResponse | SuccessResponse>('/', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  if(!username || !password) {
    res.status(400).json({
      success: false,
      message: 'user-info-not-provided'
    })
    return
  }

  const validCredentials = await validateUserCredentials({ username, password })

  if(!validCredentials.success) return res.status(401).json(validCredentials)

  const sessionRes = await createSession()

  if(typeof sessionRes == "string") {
    res.cookie('session', sessionRes)
    return res.json({
      success: true,
      message: sessionRes
    })
  }

  res.status(500).json({
    success: false,
    message: 'failed-to-create-session'
  })
})

export default router