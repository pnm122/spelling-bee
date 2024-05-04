// Utility functions for the Scores collection

import { ObjectId, WithoutId } from "mongodb";
import { ActivateWordPreviewsUtilityResponse, AddWordUtilityResponse, GetOrCreateScoreResponse, PuzzleLeaderboardUtilityResponse, SetHintUtilityResponse, UpdateScoreUtilityResponse } from "../../shared/interfaces/Response";
import getDb from "../conn";
import Score from "../interfaces/Score";
import { getPuzzleById } from "./puzzles";
import ClientScore, { Hint, UserWordFound } from "../../shared/interfaces/Score";
import debug from "../../utils/debug";
/** 
* Get a user's score on a given puzzle, creating one if it doesn't already exist. If the puzzle does not exist, return a no-puzzle error.
* @param {Object} params
* @param {string} params.userId - User's 24-character identifier
* @param {string} params.puzzleId - 24-character puzzle identifier
* @return {Promise<GetOrCreateScoreResponse>} Contains user score in data.score if successful, otherwise returns the appropriate error
*/
export async function getOrCreateScore({
  userId,
  puzzleId
} : { userId: string, puzzleId: string }): Promise<GetOrCreateScoreResponse> {
  try {
    // Object IDs must be 24 characters long
    if(!(userId.length == 24 && puzzleId.length == 24)) {
      return {
        success: false,
        message: 'no-puzzle'
      }
    }

    const db = await getDb()

    const findRes = await db.collection('Scores').findOne<Score>({
      userId: new ObjectId(userId),
      puzzleId: new ObjectId(puzzleId)
    })

    if(findRes) return {
      success: true,
      data: {
        score: findRes,
        created: false
      }
    }

    const getPuzzleRes = await getPuzzleById(puzzleId)
    if(!getPuzzleRes.success) {
      return getPuzzleRes
    }

    const newScore: WithoutId<Score> = {
      puzzleId: new ObjectId(puzzleId),
      userId: new ObjectId(userId),
      wordsFound: [],
      wordPreviewsOn: false,
      points: 0
    }
    const createRes = await db.collection<WithoutId<Score>>('Scores').insertOne(newScore)
  
    return {
      success: true,
      data: {
        score: {
          ...newScore,
          _id: createRes.insertedId
        },
        created: true
      }
    }
  } catch(e) {
    return {
      success: false,
      message: 'unknown-error'
    }
  }
}

type UpdateScoreData = Partial<Pick<ClientScore, 'hint' | 'wordPreviewsOn'>>
interface UpdateScoreParams { 
  scoreId: string, 
  data: UpdateScoreData 
}

/** 
* Update a user's hint or wordPreviewsOn on a given puzzle. If the score does not exist already, return a no-score error.
* @param {Object} params
* @param {string} params.scoreId - Score's 24-character identifier
* @param {UpdateScoreData} params.data - Data to update. Can be either or both of the following properties: hint, wordPreviewsOn
* @return {Promise<UpdateScoreUtilityResponse>} { success: true } if successful, otherwise returns the appropriate error
*/
async function updateScore({
  scoreId,
  data
}: UpdateScoreParams): Promise<UpdateScoreUtilityResponse> {
  try {
    if(scoreId.length != 24) {
      return {
        success: false,
        message: 'no-score'
      }
    }

    const db = await getDb()

    const res = await db.collection<Score>('Scores').updateOne({
      _id: new ObjectId(scoreId),
    }, {
      $set: data
    })

    if(res.matchedCount == 0) {
      return {
        success: false,
        message: 'no-score'
      }
    }

    return {
      success: true
    }
  } catch(e) {
    return {
      success: false,
      message: 'unknown-error'
    }
  }
}

/** 
* Add a word to a user's score on a puzzle
* @param {Object} params
* @param {string} params.scoreId - Score's 24-character identifier
* @param {UserWordFound} params.word - Word to add in { word: string, points: number } form
* @return {Promise<UpdateScoreUtilityResponse>} { success: true } if successful, otherwise returns the appropriate error
*/
export async function addWord({
  scoreId,
  word
}: { scoreId: string, word: UserWordFound }): Promise<AddWordUtilityResponse> {
  try {
    if(scoreId.length != 24) {
      return {
        success: false,
        message: 'no-score'
      }
    }

    const db = await getDb()

    const res = await db.collection<Score>('Scores').findOneAndUpdate({
      _id: new ObjectId(scoreId),
    }, {
      // Push the word to the start of the wordsFound array
      $push: {
        wordsFound: {
          $each: [{
            word: word.word,
            points: word.points
          }],
          $position: 0
        }
      },
      // Increment points by the points of the word
      $inc: {
        points: word.points
      }
    }, {
      // Return the updated document
      returnDocument: 'after'
    })

    if(!res) {
      return {
        success: false,
        message: 'no-score'
      }
    }

    return {
      success: true,
      data: {
        score: res
      }
    }
  } catch(e) {
    // console.log(e)
    return {
      success: false,
      message: 'unknown-error'
    }
  }
}

/** 
* Mark wordPreviewsOn as true for a given score. If the score does not exist already, return a no-score error.
* @param {Object} params
* @param {string} params.scoreId - Score's 24-character identifier
* @return {Promise<ActivateWordPreviewsUtilityResponse>} { success: true } if successful, otherwise returns the appropriate error
*/
export async function activateWordPreviews({
  scoreId
}: { scoreId: string }): Promise<ActivateWordPreviewsUtilityResponse> {
  const res = await updateScore({
    scoreId,
    data: {
      wordPreviewsOn: true
    }
  })

  return res
}

/** 
* Update a user's hint on a given puzzle. If no hint is provided, the hint is removed from the database. If the score does not exist already, return a no-score error.
* @param {Object} params
* @param {string} params.scoreId - Score's 24-character identifier
* @param {Hint | undefined} params.hint - Hint object to set; if not provided, the hint is removed from the database
* @return {Promise<SetHintUtilityResponse>} { success: true } if successful, otherwise returns the appropriate error
*/
export async function setHint({
  scoreId,
  hint
}: { scoreId: string, hint?: Hint }): Promise<SetHintUtilityResponse> {
  try {
    if(scoreId.length != 24) {
      return {
        success: false,
        message: 'no-score'
      }
    }

    const db = await getDb()

    const res = await db.collection<Score>('Scores').updateOne({
      _id: new ObjectId(scoreId),
    }, hint 
        ? { $set: { hint } } 
        // Remove the hint if a hint isn't provided
        : { $unset: { hint: 1 } }
    )

    if(res.matchedCount == 0) {
      return {
        success: false,
        message: 'no-score'
      }
    }

    return {
      success: true
    }
  } catch(e) {
    return {
      success: false,
      message: 'unknown-error'
    }
  }
}
/** 
* Get the top 25 scores of a puzzle
* @param {string} puzzleId - Puzzle to get leaderboard of
* @return {ReturnValueDataTypeHere} Brief description of the returning value here.
*/
export async function getPuzzleLeaderboard(
  puzzleId: string
): Promise<PuzzleLeaderboardUtilityResponse> {
  try {
    if(puzzleId.length != 24) {
      return {
        success: false,
        message: 'no-puzzle'
      }
    }

    const db = await getDb()

    const res = await db.collection('Scores').find<Score>({
      puzzleId: new ObjectId(puzzleId)
    }, {
      projection: {
        _id: 1,
        points: 1,
        userId: 1,
      },
      sort: {
        points: -1
      }
    }).limit(25).toArray()

    return {
      success: true,
      data: {
        scores: res.map(v => ({
          id: v._id.toString(),
          points: v.points,
          userId: v.userId.toString(),
          username: 'UNKNOWN'
        }))
      }
    }

  } catch(e) {
    debug(e, 'error')
    return {
      success: false,
      message: 'unknown-error'
    }
  }
}