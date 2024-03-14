import express from 'express';
import { ErrorResponse, SignUpErrors, SuccessResponse } from '../../interfaces/Response';
import { SignupRequest } from '../../interfaces/User';
import { createUser } from '../../db/utils/users';
import { createSession } from '../../db/utils/sessions';

const router = express.Router();

router.post<SignupRequest, ErrorResponse<SignUpErrors> | SuccessResponse>('/', async (req, res) => {
  const { username, password } = req.body
  if(!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'user-info-not-provided'
    })
  }

  const createUserRes = await createUser({ username, password })
  if(createUserRes.message == 'user-exists') return res.status(400).json(createUserRes)
  if(!createUserRes.success) return res.status(500).json(createUserRes)

  const sessionRes = await createSession(createUserRes.data!.insertedId, username)
  if(!sessionRes.success) return res.status(500).json(sessionRes)
  
  return res.json({
    success: true
  })
});

export default router;