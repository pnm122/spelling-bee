import express from 'express'
import { DailyPuzzleData, DailyPuzzleErrors, ErrorResponse, SuccessResponse } from '../../shared/interfaces/Response'
import Puzzle from '../../shared/interfaces/Puzzle'
import { getPuzzle } from '../../db/utils/puzzles'

const router = express.Router()

router.get<{}, SuccessResponse<DailyPuzzleData> | ErrorResponse<DailyPuzzleErrors>>('/', async (req, res) => {
  const puzzleId = '6612146a676f0c3f52f89f47'
  
  const puzzleRes = await getPuzzle(puzzleId)

  if(!puzzleRes.success) {
    if(puzzleRes.message == 'no-puzzle') return res.status(404).json(puzzleRes)
    else return res.status(500).json(puzzleRes)
  }

  const { _id, ...puzzle } = puzzleRes.data.puzzle

  res.json({
    success: true,
    data: {
      puzzle: {
        id: puzzleId,
        ...puzzle
      }
    }
  })
})

export default router