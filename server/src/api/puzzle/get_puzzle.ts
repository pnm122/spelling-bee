import express from 'express'
import { ErrorResponse, GetPuzzleData, GetPuzzleErrors, SuccessResponse } from '../../interfaces/Response'
import Puzzle from '../../interfaces/Puzzle'

const router = express.Router()

router.get<{}, SuccessResponse<GetPuzzleData> | ErrorResponse<GetPuzzleErrors>>('/', (req, res) => {
  const tempPuzzle: Puzzle = {
    id: 'abcdef',
    centerLetter: 'A',
    outsideLetters: ['S', 'T', 'R', 'F', 'I', 'H'],
    wordList: ['AFFT', 'AFRIT', 'AFRITS', 'AIRISH', 'AIRS', 'AIRT', 'AIRTH', 'AIRTHS', 'AIRTS', 'AITH', 'AITIS', 'AITS', 'ARFS', 'ARISH', 'ARIST', 'ARITH', 'ARRIS', 'ARRISH', 'ARSIS', 'ARTHRITIS', 'ARTIST', 'ARTISTS', 'ARTS', 'ASIS', 'ASSI', 'ASSIS', 'ASSISH', 'ASSIST', 'ASSISTS', 'ASSITH', 'ASST', 'ASTIR', 'ASTR', 'ATHIRST', 'ATTRIST', 'FAFF', 'FAIRISH', 'FAIRS', 'FAIT', 'FAITHS', 'FAITS', 'FART', 'FARTH', 'FARTS', 'FASH', 'FASS', 'FASTI', 'FASTISH', 'FASTS', 'FATH', 'FATS', 'FATTISH', 'FIAR', 'FIARS', 'FIAT', 'FIATS', 'FRAIST', 'FRASS', 'FRAT', 'FRATS', 'FRIAR', 'FRIARS', 'HAFFIT', 'HAFFITS', 'HAFIS', 'HAFT', 'HAFTS', 'HAHS', 'HAIR', 'HAIRIF', 'HAIRS', 'HAIRST', 'HAIT', 'HARISH', 'HARR', 'HARSH', 'HARSHISH', 'HARST', 'HASH', 'HASHISH', 'HASHT', 'HAST', 'HASTIF', 'HASTISH', 'HATH', 'HATHI', 'HATS', 'HATT', 'IASIS', 'ITAI', 'ITTRIA', 'RAFFISH', 'RAFFS', 'RAFT', 'RAFTS', 'RAIF', 'RARISH', 'RASH', 'RATFISH', 'RATH', 'RATS', 'RATTI', 'RATTISH', 'RIFART', 'RIFFRAFF', 'RIFFRAFFS', 'SAFT', 'SAHH', 'SAITH', 'SARIF', 'SARIS', 'SASH', 'SATI', 'SATIRIST', 'SATIRISTS', 'SATIS', 'SHAFII', 'SHAFT', 'SHAFTS', 'SHAHI', 'SHAHS', 'SHAI', 'SHARIF', 'SHARIFS', 'SHASTRI', 'SHAT', 'SHIAI', 'SHIRRA', 'SHITA', 'SHITTAH', 'SHITTAHS', 'SHRAF', 'SIRIASIS', 'SIRRA', 'SIRRAH', 'SIRRAHS', 'SIRRAS', 'SISTRA', 'SITAR', 'SITARIST', 'SITARISTS', 'SITARS', 'SITFAST', 'STAFF', 'STAFFISH', 'STAIR', 'STAIRS', 'STAITH', 'STARFISH', 'START', 'STARTISH', 'STARTS', 'STASH', 'STASIS', 'STAT', 'STATIST', 'STATISTS', 'STATS', 'STIRRA', 'STRA', 'STRAITS', 'STRASS', 'STRATH', 'STRATHS', 'STRATI', 'STRIA', 'TAHR', 'TAHRS', 'TAISH', 'TARI', 'TARIFF', 'TARIFFIST', 'TARIFFS', 'TARISH', 'TARRI', 'TARRISH', 'TARS', 'TARSI', 'TARSITIS', 'TART', 'TARTISH', 'TARTS', 'TASH', 'TASHRIF', 'TATH', 'TATS', 'THARF', 'THAT', 'THATS', 'THIASI', 'THRASH', 'THRAST', 'TIAR', 'TISAR', 'TITAR', 'TRAH', 'TRAIST', 'TRAIT', 'TRAITS', 'TRASH', 'TRASS', 'TRIARII', 'TRIFA', 'TSAR', 'TSARIST', 'TSARISTS', 'TSARS', 'TSIA'],
    date: '03/18/2024'
  }

  res.json({
    success: true,
    data: {
      puzzle: tempPuzzle
    }
  })
})

export default router