import express from 'express'
import { authenticated } from '../../middlewares'
import { GetCurrentUserScoreRequest, WithSession } from '../../shared/interfaces/Request'
import { getOrCreateScore } from '../../db/utils/scores'
import { GetCurrentUserScoreResponse } from '../../shared/interfaces/Response'
import { incrementPuzzlesPlayed } from '../../db/utils/users'

const router = express.Router()

router.use(authenticated)
router.get<WithSession<GetCurrentUserScoreRequest>, GetCurrentUserScoreResponse>('/', async (req, res) => {
  const body: WithSession<GetCurrentUserScoreRequest> = req.body
  
  const dbRes = await getOrCreateScore({ 
    userId: body.session.userId, 
    puzzleId: body.puzzleId
  })

  if(!dbRes.success) {
    if(dbRes.message == 'no-puzzle') return res.status(404).json(dbRes)
    else return res.status(500).json(dbRes)
  }

  const { created } = dbRes.data

  // Add 1 to the user's puzzles played if the puzzle score was created (it didn't exist yet)
  if(created) {
    incrementPuzzlesPlayed({ userId: body.session.userId })
  }

  const { _id, puzzleId, userId, ...dbScore } = dbRes.data.score
  res.json({
    success: true,
    data: {
      score: {
        ...dbScore,
        puzzleId: puzzleId.toString(),
        userId: userId.toString(),
        id: _id.toString()
      }
    }
  })
})

export default router