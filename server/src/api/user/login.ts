import express from "express";
import { LoginRequest } from "../../shared/interfaces/User";
import { ErrorResponse, LogInData, LoginErrors, SuccessResponse } from "../../shared/interfaces/Response";
import { validateUserCredentials } from "../../db/utils/users";
import { createSession } from "../../db/utils/sessions";
import { isValidPassword, isValidUsername } from "../../shared/utils/validation";

const router = express.Router()

router.post<LoginRequest, ErrorResponse<LoginErrors> | SuccessResponse<LogInData>>('/', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  if(!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'user-info-not-provided'
    })
  }

  if(!isValidUsername(username.trim())) {
    return res.status(400).json({
      success: false,
      message: 'invalid-username'
    })
  }

  if(!isValidPassword(password.trim())) {
    return res.status(400).json({
      success: false,
      message: 'invalid-password'
    })
  }

  const validCredentials = await validateUserCredentials({ username, password })

  if(!validCredentials.success) return res.status(401).json(validCredentials)

  const sessionRes = await createSession(validCredentials.data!.user.id)

  if(sessionRes.success) {
    // * 1000 because maxAge is in ms, but SESSION_EXPIRE_TIME is in seconds
    res.cookie('session', sessionRes.data!.sessionId, { secure: true, sameSite: "none", maxAge: parseInt(process.env.SESSION_EXPIRE_TIME!) * 1000 })
    return res.json({
      success: true,
      data: {
        user: validCredentials.data.user
      }
    })
  }

  res.status(500).json({
    success: false,
    message: sessionRes.message
  })
})

export default router