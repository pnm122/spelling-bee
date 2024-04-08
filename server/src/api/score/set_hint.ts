import express from 'express'
import { authenticated } from '../../middlewares'
import { SetHintRequest, WithSession } from '../../shared/interfaces/Request'
import { setHint } from '../../db/utils/scores'
import { SetHintResponse } from '../../shared/interfaces/Response'

const router = express.Router()

router.use(authenticated)
router.post<WithSession<SetHintRequest>, SetHintResponse>('/', async (req, res) => {
  const body: WithSession<SetHintRequest> = req.body
  const { scoreId, hint } = body

  if(!scoreId) return res.status(400).json({
    success: false,
    message: 'no-score'
  })

  if(!hint) return res.status(400).json({
    success: false,
    message: 'no-hint'
  })

  if(!hint.lettersGiven || !hint.word) return res.status(400).json({
    success: false,
    message: 'invalid-hint'
  })

  const updateRes = await setHint({
    scoreId,
    hint
  })

  if(!updateRes.success) {
    if(updateRes.message == 'no-score') return res.status(400).json(updateRes)
    else return res.status(500).json(updateRes)
  }

  return res.json(updateRes)
})

export default router