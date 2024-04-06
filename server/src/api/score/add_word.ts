import express from 'express'
import { authenticated } from '../../middlewares'
import { AddWordRequest, WithSession } from '../../shared/interfaces/Request'
import { AddWordResponse } from '../../shared/interfaces/Response'
import { addWord } from '../../db/utils/scores'
import { addWordToUser } from '../../db/utils/users'

const router = express.Router()

router.use(authenticated)
router.get<WithSession<AddWordRequest>, AddWordResponse>('/', async (req, res) => {
  const body: WithSession<AddWordRequest> = req.body
  const updateScoreRes = await addWord({
    scoreId: body.scoreId,
    word: body.word
  })

  if(!updateScoreRes.success) {
    if(updateScoreRes.message == 'no-score') return res.status(404).json(updateScoreRes)
    if(updateScoreRes.message == 'unknown-error') return res.status(500).json(updateScoreRes)
  }

  const updateStatsRes = await addWordToUser({
    userId: body.session.userId,
    word: body.word
  })

  if(!updateStatsRes.success) {
    if(updateStatsRes.message == 'invalid-user-id') return res.status(404).json(updateStatsRes)
    if(updateStatsRes.message == 'unknown-error') return res.status(500).json(updateStatsRes)
  }

  res.json({ success: true })

  

  // res.json(updateRes)
})

export default router