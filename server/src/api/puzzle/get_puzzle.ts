import express, { Request, Response } from 'express'
import { GetPuzzleResponse } from '../../shared/interfaces/Response'
import { getPuzzleById } from '../../db/utils/puzzles'
import { authenticated } from '../../middlewares'
import { GetPuzzleParams } from '../../shared/interfaces/Params'

const router = express.Router()

router.use(authenticated)
router.get('/', async (req: Request<{}, {}, {}, GetPuzzleParams>, res: Response<GetPuzzleResponse>) => {
  const puzzleRes = await getPuzzleById(req.query.id)

  if(!puzzleRes.success) {
    if(puzzleRes.message == 'no-puzzle') return res.status(404).json(puzzleRes)
    else return res.status(500).json(puzzleRes)
  }

  const { _id, ...puzzle } = puzzleRes.data.puzzle

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