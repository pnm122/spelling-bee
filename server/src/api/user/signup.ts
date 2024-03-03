import express from 'express';
import { ErrorResponse, SuccessResponse } from '../../interfaces/Response';
import { SignupRequest } from '../../interfaces/User';
import { createUser } from '../../db/utils/users';

const router = express.Router();

router.post<SignupRequest, ErrorResponse | SuccessResponse>('/', async (req, res) => {
  const { username, password } = req.body
  if(!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'user-info-not-provided'
    })
  }

  const createUserRes = await createUser({ username, password })

  if(createUserRes.success) return res.json(createUserRes)
  else if(createUserRes.message == 'user-exists') return res.status(400).json(createUserRes)
  else return res.status(500).json(createUserRes)
});

export default router;