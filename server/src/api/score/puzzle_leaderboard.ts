import express from 'express'
import { PuzzleLeaderboardParams } from '../../shared/interfaces/Params'
import { PuzzleLeaderboardResponse } from '../../shared/interfaces/Response'
import { getPuzzleLeaderboard } from '../../db/utils/scores'

const router = express.Router()

router.get<
  {}, 
  PuzzleLeaderboardResponse, 
  {}, 
  PuzzleLeaderboardParams
>('/', async (req, res) => {
  const queryPuzzleId = req.query.puzzleId

  if(!queryPuzzleId) {
    return res.status(400).json({
      success: false,
      message: 'no-puzzle'
    })
  }

  const leaderboardRes = await getPuzzleLeaderboard(queryPuzzleId)

  if(!leaderboardRes.success) {
    if(leaderboardRes.message == 'no-puzzle') return res.status(500).json(leaderboardRes)
    else return res.status(400).json(leaderboardRes)
  }

  res.json(leaderboardRes)
})

export default router