// Utility functions for the Puzzles collection

import { FindOptions, ObjectId, WithoutId } from "mongodb"
import { AllPuzzlesUtilityResponse, GetPuzzleUtilityResponse, InsertPuzzleResponse } from "../../shared/interfaces/Response"
import getDb from "../conn"
import Puzzle from "../interfaces/Puzzle"

export async function getPuzzleById(
  puzzleId: string,
  projection?: FindOptions<Document>['projection']
): Promise<GetPuzzleUtilityResponse> {
  try {
    const db = await getDb()

    const findRes = await db.collection('Puzzles').findOne<Puzzle>({ 
      _id: new ObjectId(puzzleId)
    }, projection ? {
      projection
    } : undefined)

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

export async function getPuzzleByDate(date: string): Promise<GetPuzzleUtilityResponse> {
  try {
    const db = await getDb()

    const findRes = await db.collection('Puzzles').findOne<Puzzle>({ date })

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

// Fetch the 10 most recent puzzles
// TODO: Pagination
export async function getAllPuzzles(): Promise<AllPuzzlesUtilityResponse> {
  try {
    const db = await getDb()

    const findRes = await db.collection('Puzzles').find<Pick<Puzzle, '_id' | 'centerLetter' | 'outsideLetters' | 'date'>>(
      {}, {
      projection: {
        date: 1,
        centerLetter: 1,
        outsideLetters: 1
      },
      sort: {
        date: -1
      }
    }).limit(10).toArray()

    return {
      success: true,
      data: { puzzles: findRes }
    }
  } catch(e) {
    return {
      success: false,
      message: 'unknown-error'
    }
  }
}

export async function insertPuzzle(puzzle: WithoutId<Puzzle>): Promise<InsertPuzzleResponse> {
  try {
    if(
      !puzzle || 
      !puzzle.centerLetter || 
      !puzzle.date || 
      !puzzle.maxPoints || 
      !puzzle.outsideLetters || 
      !puzzle.wordList
    ) {
      return {
        success: false,
        message: 'invalid-puzzle'
      }
    }

    const db = await getDb()

    const insertRes = await db.collection<WithoutId<Puzzle>>('Puzzles').insertOne(puzzle)

    return {
      success: true,
      data: {
        puzzle: {
          _id: insertRes.insertedId,
          ...puzzle
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