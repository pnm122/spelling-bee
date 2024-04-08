// Utility functions for the Puzzles collection

import { ObjectId, WithoutId } from "mongodb"
import { GetPuzzleUtilityResponse } from "../../shared/interfaces/Response"
import getDb from "../conn"
import Puzzle, { OutsideLetters } from "../interfaces/Puzzle"
import { readFile } from "fs"
import { getTotalPoints, getUniqueLetters } from "../../shared/utils/points"
import getMatchingWords from "../../utils/getMatchingWords"

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

export async function generatePuzzle(): Promise<WithoutId<Puzzle>> {
  const MIN_WORDLIST_LENGTH = 30
  const promise = new Promise<WithoutId<Puzzle>>((resolve, reject) => {
    readFile('data/pangrams.txt', 'utf8', (pangramsErr, pangramsData) => {
      if(pangramsErr) {
        return reject(pangramsErr)
      }
  
      readFile('data/wordlist.txt', 'utf8', (wordListErr, wordListData) => {
        if(wordListErr) {
          return reject(wordListErr)
        }
  
        // Split files into lines
        const pangrams = pangramsData.match(/[^\r\n]+/g)!
        const validWordList = wordListData.match(/[^\r\n]+/g)!
  
        let centerLetter = ''
        let outsideLetters: OutsideLetters = ['', '', '', '', '', '']
        let wordList: string[] = []
  
        // Generate a "good" random puzzle
        // I define "good" as a puzzle with at least one pangram and MIN_WORDLIST_LENGTH words
        // Until a puzzle is generated with these conditions:
        // Try a random pangram, using one letter at random as the center letter
        // If this puzzle doesn't generate MIN_WORDLIST_LENGTH words, try another random combo
        while(wordList.length < MIN_WORDLIST_LENGTH) {
          // Pull a random pangram
          const randomPangramIndex = Math.round(Math.random() * (pangrams.length - 1))
          const randomPangram = pangrams[randomPangramIndex]
  
          // Choose a random center letter, leaving the rest as outside letters
          const letters = getUniqueLetters(randomPangram)
          const centerLetterIndex = Math.round(Math.random() * (letters.length - 1))
          centerLetter = letters[centerLetterIndex]
          outsideLetters = letters.filter(l => l != centerLetter) as OutsideLetters
  
          // Generate the word list based on these conditions
          wordList = getMatchingWords(validWordList, centerLetter, outsideLetters)
          console.log(randomPangram, centerLetter, wordList.length)
        }
  
        const puzzle: WithoutId<Puzzle> = {
          centerLetter,
          outsideLetters,
          wordList,
          maxPoints: getTotalPoints(wordList),
          date: '04/08/2024'
        }

        console.log(puzzle)

        resolve(puzzle)
      })
    })
  })

  return promise
}