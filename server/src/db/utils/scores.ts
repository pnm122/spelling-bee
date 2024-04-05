// Utility functions for the Scores collection

import { ObjectId, WithoutId } from "mongodb";
import { ErrorResponse, GetOrCreateScoreErrors, SuccessResponse } from "../../shared/interfaces/Response";
import getDb from "../conn";
import Score from "../interfaces/Score";
import { getPuzzle } from "./puzzles";

export async function getOrCreateScore({
  userId,
  puzzleId
} : { userId: string, puzzleId: string }): Promise<SuccessResponse<{score: Score}> | ErrorResponse<GetOrCreateScoreErrors>> {
  try {
    const db = await getDb()

    // Object IDs must be 24 characters long
    if(!(userId.length == 24 && puzzleId.length == 24)) {
      return {
        success: false,
        message: 'no-puzzle'
      }
    }

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