import express from "express";
import { ErrorResponse, LogoutErrors, SuccessResponse } from "../../shared/interfaces/Response";
import { deleteSession } from "../../db/utils/sessions";

const router = express.Router()

router.post<{}, ErrorResponse<LogoutErrors> | SuccessResponse>('/', async (req, res) => {
  const sessionId: string | undefined = req.cookies['session']

  if(!sessionId) {
    return res.status(400).json({
      success: false,
      message: 'no-session'
    })
  }

  const deleteRes = await deleteSession(sessionId)

  if(deleteRes.success) {
    // Delete client's session cookie since the session was successfully removed from the database
    res.clearCookie('session', { secure: true, sameSite: "none" })

    return res.json({
      success: true,
      message: 'Logged out'
    })
  }

  if(deleteRes.message == 'invalid-session') {
    return res.status(401).json(deleteRes)
  }

  res.status(500).json({
    success: false,
    message: 'unknown-error'
  })
})

export default router