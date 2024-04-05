import express from 'express'
import { authenticated } from '../../middlewares'
import { UpdateScoreRequest, WithSession } from '../../shared/interfaces/Request'
import { UpdateScoreResponse } from '../../shared/interfaces/Response'
import { updateScore } from '../../db/utils/scores'

const router = express.Router()

router.use(authenticated)
router.get<WithSession<UpdateScoreRequest>, UpdateScoreResponse>('/', async (req, res) => {
  const body: WithSession<UpdateScoreRequest> = req.body
  const updateRes = await updateScore({
    scoreId: body.id,
    data: body.data
  })

  if(!updateRes.success) {
    if(updateRes.message == 'no-score') return res.status(404).json(updateRes)
    if(updateRes.message == 'unknown-error') return res.status(500).json(updateRes)
  }

  res.json(updateRes)
})

export default router