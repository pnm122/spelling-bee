import express from 'express'
import { ErrorResponse, GetPuzzleData, GetPuzzleErrors, SuccessResponse } from '../../shared/interfaces/Response'
import Puzzle from '../../shared/interfaces/Puzzle'

const router = express.Router()

router.get<{}, SuccessResponse<GetPuzzleData> | ErrorResponse<GetPuzzleErrors>>('/', (req, res) => {
  const tempPuzzle: Puzzle = {
    id: 'abcdef',
    centerLetter: 'N',
    outsideLetters: ['D', 'M', 'E', 'U', 'I', 'R'],
    wordList: ['DENIED', 'DENIER', 'DENUDE', 'DINE', 'DINED', 'DINER', 'DINNER', 'DUNE', 'ENDED', 'ENDER', 'ENDURE', 'ENDURED', 'ENNUI', 'ERMINE', 'IMMUNE', 'INDEED', 'INNER', 'MEND', 'MENDED', 'MENDER', 'MENU', 'MIEN', 'MIND', 'MINDED', 'MINE', 'MINED', 'MINER', 'MINI', 'MINIMUM', 'MINUEND', 'NEED', 'NEEDED', 'NINE', 'NUDE', 'REDDEN', 'REDDENED', 'REIN', 'REINDEER', 'REINED', 'REMIND', 'REMINDED', 'REMINDER', 'REND', 'RENDER', 'RENDERED', 'RERUN', 'RIDDEN', 'RIND', 'RUIN', 'RUINED', 'RUMEN', 'RUNNER', 'UNDER', 'UNDERMINE', 'UNDERMINED', 'UNDID', 'UNDUE', 'UNNEEDED', 'URINE'],
    date: '04/03/2024',
    maxPoints: 1000
  }

  res.json({
    success: true,
    data: {
      puzzle: tempPuzzle
    }
  })
})

export default router