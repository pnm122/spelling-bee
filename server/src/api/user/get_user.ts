import express from "express";
import { authenticated } from "../../middlewares";
import { getUser } from "../../db/utils/users";
import { ErrorResponse, GetUserData, GetUserErrors, SuccessResponse } from "../../shared/interfaces/Response";
import Session from "../../db/interfaces/Session";

const router = express.Router()

router.use(authenticated)

router.get<{ session: Session }, SuccessResponse<GetUserData> | ErrorResponse<GetUserErrors>>('/', async (req, res) => {
  const session = req.body.session as Session
  
  const getUserRes = await getUser(session.userId)

  if(!getUserRes.success) {
    if(getUserRes.message == 'invalid-user-id') return res.status(401).json(getUserRes)
    else return res.status(500).json(getUserRes)
  }

  res.json(getUserRes)
})

export default router