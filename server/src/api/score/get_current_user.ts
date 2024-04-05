import express from 'express'
import { authenticated } from '../../middlewares'
import { GetCurrentUserScoreRequest, WithSession } from '../../shared/interfaces/Request'
import { getOrCreateScore } from '../../db/utils/scores'
import { GetCurrentUserScoreResponse } from '../../shared/interfaces/Response'

const router = express.Router()

router.use(authenticated)
router.get<WithSession<GetCurrentUserScoreRequest>, GetCurrentUserScoreResponse>('/', async (req, res) => {
  const body: WithSession<GetCurrentUserScoreRequest> = req.body
  
  const dbRes = await getOrCreateScore({ 
    userId: body.session.userId, 
    puzzleId: body.puzzleId
  })

  if(!dbRes.success) {
    if(dbRes.message == 'no-puzzle') res.status(404).json(dbRes)
    if(dbRes.message == 'unknown-error') res.status(500).json(dbRes)
  } else {
    const { _id, ...dbScore } = dbRes.data.score
    res.json({
      success: true,
      data: {
        score: {
          ...dbScore,
          puzzleId: dbScore.puzzleId.toString(),
          userId: dbScore.userId.toString(),
          id: _id.toString()
        }
      }
    })
  }
})

export default router