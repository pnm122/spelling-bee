import express from 'express'
import { AllPuzzlesResponse } from '../../shared/interfaces/Response'
import { getAllPuzzles } from '../../db/utils/puzzles'
import Puzzle from '../../shared/interfaces/Puzzle'
import { authenticated } from '../../middlewares'
import { WithSession } from '../../shared/interfaces/Request'

const router = express.Router()

router.use(authenticated)

// Fetch the 10 most recent puzzles
// TODO: Pagination
router.get<WithSession, AllPuzzlesResponse>('/', async (req, res) => {
  const allPuzzlesRes = await getAllPuzzles()

  if(!allPuzzlesRes.success) return res.status(500).json(allPuzzlesRes)

  const allPuzzlesReturn: Pick<Puzzle, 'id' | 'centerLetter' | 'outsideLetters' | 'date'>[]
    = allPuzzlesRes.data.puzzles.map(p => {
    const { _id, ...puzzle } = p
    return {
      id: p._id.toString(),
      ...puzzle
    }
  })

  res.json({
    success: true,
    data: {
      puzzles: allPuzzlesReturn
    }
  })
})

export default router