// Utility functions for the Puzzles collection

import { ObjectId, WithoutId } from "mongodb"
import { GetPuzzleUtilityResponse, InsertPuzzleResponse } from "../../shared/interfaces/Response"
import getDb from "../conn"
import Puzzle, { OutsideLetters } from "../interfaces/Puzzle"
import { readFile } from "fs"
import { getTotalPoints, getUniqueLetters, isPangram } from "../../shared/utils/points"
import getMatchingWords from "../../utils/getMatchingWords"
import getTodaysDate from "../../utils/getTodaysDate"

export async function getPuzzleById(puzzleId: string): Promise<GetPuzzleUtilityResponse> {
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