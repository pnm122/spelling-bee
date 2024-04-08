import express from 'express'
import { DailyPuzzleData, DailyPuzzleErrors, ErrorResponse, SuccessResponse } from '../../shared/interfaces/Response'
import { getPuzzleByDate, insertPuzzle } from '../../db/utils/puzzles'
import generatePuzzle from '../../utils/generatePuzzle'
import getTodaysDate from '../../utils/getTodaysDate'

const router = express.Router()

router.get<{}, SuccessResponse<DailyPuzzleData> | ErrorResponse<DailyPuzzleErrors>>('/', async (req, res) => {
  const getPuzzleRes = await getPuzzleByDate(getTodaysDate())

  if(getPuzzleRes.success) {
    const { _id, ...puzzle } = getPuzzleRes.data.puzzle
    return res.json({
      success: true,
      data: {
        puzzle: {
          id: _id.toString(),
          ...puzzle
        }
      }
    })
  }

  const newPuzzleData = await generatePuzzle()
  const insertRes = await insertPuzzle(newPuzzleData)
  
  if(!insertRes.success) {
    return res.status(500).json({ success: false, message: 'failed-to-create-puzzle' })
  }

  const { _id, ...puzzle } = insertRes.data.puzzle

  res.json({
    success: true,
    data: {
      puzzle: {
        id: _id.toString(),
        ...puzzle
      }
    }
  })
})

export default router