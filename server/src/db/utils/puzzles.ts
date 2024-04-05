// Utility functions for the Puzzles collection

import { ObjectId } from "mongodb"
import { GetPuzzleUtilityResponse } from "../../shared/interfaces/Response"
import getDb from "../conn"
import Puzzle from "../interfaces/Puzzle"

export async function getPuzzle(puzzleId: string): Promise<GetPuzzleUtilityResponse> {
  try {
    const db = await getDb()

    const findRes = await db.collection('Puzzles').findOne<Puzzle>({ _id: new ObjectId(puzzleId) })

    if(findRes) return {
      success: true,
      data: { puzzle: findRes }
    }
    
    return {
      success: false,
      message: 'no-puzzle'
    }
  } catch(e) {
    return {
      success: false,
      message: 'unknown-error'
    }
  }
}