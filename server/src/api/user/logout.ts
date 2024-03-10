import express from "express";
import { ErrorResponse, SuccessResponse } from "../../interfaces/Response";
import { authenticated } from "../../middlewares";

const router = express.Router()

router.use(authenticated)

router.post<{}, ErrorResponse | SuccessResponse>('/', async (req, res) => {
  res.json({
    success: true,
    message: 'Session updated'
  })

  // res.status(500).json({
  //   success: false,
  //   message: 'unknown-error'
  // })
})

export default router