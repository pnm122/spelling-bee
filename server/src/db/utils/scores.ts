// Utility functions for the Scores collection

import { ObjectId, WithoutId } from "mongodb";
import { AddWordUtilityResponse, GetOrCreateScoreResponse, UpdateScoreUtilityResponse } from "../../shared/interfaces/Response";
import getDb from "../conn";
import Score from "../interfaces/Score";
import { getPuzzle } from "./puzzles";
import ClientScore, { UserWordFound } from "../../shared/interfaces/Score";
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
      data: { score: findRes }
    }

    const getPuzzleRes = await getPuzzle(puzzleId)
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
        }
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
export async function updateScore({
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

    const res = await db.collection<Score>('Scores').updateOne({
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
    console.log(e)
    return {
      success: false,
      message: 'unknown-error'
    }
  }
}