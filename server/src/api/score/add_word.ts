import express from 'express'
import { authenticated } from '../../middlewares'
import { AddWordRequest, WithSession } from '../../shared/interfaces/Request'
import { AddWordResponse } from '../../shared/interfaces/Response'
import { addWord } from '../../db/utils/scores'

const router = express.Router()

router.use(authenticated)
router.get<WithSession<AddWordRequest>, AddWordResponse>('/', async (req, res) => {
  const body: WithSession<AddWordRequest> = req.body
  const updateRes = await addWord({
    scoreId: body.scoreId,
    word: body.word
  })

  // TODO: Update the user's stats as well
  

  if(!updateRes.success) {
    if(updateRes.message == 'no-score') return res.status(404).json(updateRes)
    if(updateRes.message == 'unknown-error') return res.status(500).json(updateRes)
  }

  res.json(updateRes)
})

export default router