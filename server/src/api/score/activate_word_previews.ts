import express from 'express'
import { authenticated } from '../../middlewares'
import { ActivateWordPreviewsRequest, WithSession } from '../../shared/interfaces/Request'
import { ActivateWordPreviewsResponse } from '../../shared/interfaces/Response'
import { activateWordPreviews } from '../../db/utils/scores'

const router = express.Router()

router.use(authenticated)
router.post<WithSession<ActivateWordPreviewsRequest>, ActivateWordPreviewsResponse>('/', async (req, res) => {
  const scoreId = (req.body as WithSession<ActivateWordPreviewsRequest>).scoreId

  if(!scoreId) return res.status(400).json({
    success: false,
    message: 'no-score'
  })

  const activateRes = await activateWordPreviews({ scoreId })

  if(!activateRes.success) {
    if(activateRes.message == 'no-score') return res.status(400).json(activateRes)
    else return res.status(500).json(activateRes)
  }

  return res.json(activateRes)
})

export default router