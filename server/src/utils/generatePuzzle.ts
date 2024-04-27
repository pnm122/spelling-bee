import { WithoutId } from "mongodb"
import DBPuzzle, { OutsideLetters } from "../db/interfaces/Puzzle"
import { getTotalPoints, getUniqueLetters, isPangram } from "../shared/utils/points"
import getMatchingWords from "./getMatchingWords"
import getTodaysDate from "../shared/utils/getTodaysDate"
import { readFile } from "fs"
import shuffle from "./shuffle"

export default async function generatePuzzle(): Promise<WithoutId<DBPuzzle>> {
  const MIN_POINTS = 200
  const MAX_POINTS = 500
  const promise = new Promise<WithoutId<DBPuzzle>>((resolve, reject) => {
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
        let maxPoints: number = -1
  
        // Generate a "good" random puzzle
        // I define "good" as a puzzle with at least one pangram and between MIN_POINTS and MAX_POINTS points
        // Until a puzzle is generated with these conditions:
        // Try a random pangram, using one letter at random as the center letter
        // If this puzzle doesn't generate between MIN_POINTS and MAX_POINTS points, try another random combo
        // With poorly chosen MIN_PONTS and MAX_POINTS, this could go on for a long time, but the numbers I've chosen
        // are relatively common, so it usually doesn't take more than a couple iterations to find a match
        while(maxPoints < MIN_POINTS || maxPoints > MAX_POINTS) {
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
          maxPoints = getTotalPoints(wordList)
          let numPangrams = 0
          for(let word of wordList) {
            if(isPangram(word)) numPangrams++
          }
        }

        const puzzle: WithoutId<DBPuzzle> = {
          centerLetter,
          outsideLetters: shuffle<OutsideLetters>(outsideLetters),
          wordList,
          maxPoints,
          date: getTodaysDate()
        }

        resolve(puzzle)
      })
    })
  })

  return promise
}