import express from 'express'
import { authenticated } from '../../middlewares'
import { WithSession } from '../../shared/interfaces/Request'
import { getOrCreateScore } from '../../db/utils/scores'
import { GetCurrentUserScoreResponse } from '../../shared/interfaces/Response'
import { getUser, incrementPuzzlesPlayed } from '../../db/utils/users'
import { GetCurrentUserParams } from '../../shared/interfaces/Params'

const router = express.Router()

router.use(authenticated)
router.get<
  {}, 
  GetCurrentUserScoreResponse,
  WithSession,
  GetCurrentUserParams
>('/', async (req, res) => {
  const queryPuzzleId = req.query.puzzleId

  if(!queryPuzzleId) {
    return res.status(400).json({
      success: false,
      message: 'no-puzzle'
    })
  }

  const userRes = await getUser(req.body.session.userId)
  if(!userRes.success) {
    if(userRes.message == 'invalid-user-id') return res.status(400).json(userRes)
    else return res.status(500).json(userRes)
  }
  
  const dbRes = await getOrCreateScore({ 
    userId: req.body.session.userId, 
    username: userRes.data.user.username,
    puzzleId: queryPuzzleId
  })

  if(!dbRes.success) {
    if(dbRes.message == 'no-puzzle') return res.status(404).json(dbRes)
    else return res.status(500).json(dbRes)
  }

  const { created } = dbRes.data

  // Add 1 to the user's puzzles played if the puzzle score was created (it didn't exist yet)
  if(created) {
    incrementPuzzlesPlayed({ userId: req.body.session.userId })
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