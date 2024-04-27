import express from 'express';
import { ErrorResponse, SignUpData, SignUpErrors, SuccessResponse } from '../../shared/interfaces/Response';
import { SignupRequest } from '../../shared/interfaces/User';
import { createUser } from '../../db/utils/users';
import { createSession } from '../../db/utils/sessions';
import { isValidPassword, isValidUsername } from '../../shared/utils/validation';

const router = express.Router();

router.post<SignupRequest, ErrorResponse<SignUpErrors> | SuccessResponse<SignUpData>>('/', async (req, res) => {
  const { username, password } = req.body
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

  const createUserRes = await createUser({ username, password })
  if(!createUserRes.success) {
    if(createUserRes.message == 'user-exists') return res.status(400).json(createUserRes)
    return res.status(500).json(createUserRes)
  }

  const sessionRes = await createSession(createUserRes.data!.user.id)
  if(!sessionRes.success) return res.status(500).json(sessionRes)

  res.cookie('session', sessionRes.data!.sessionId, { maxAge: parseInt(process.env.SESSION_EXPIRE_TIME!) * 1000 })
  return res.json({
    success: true,
    data: {
      user: createUserRes.data.user
    }
  })
});

export default router;