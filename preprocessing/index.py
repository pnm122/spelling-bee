## WORDLIST SOURCE: https://users.cs.duke.edu/~ola/ap/linuxwords

import re
import gzip
from collections import defaultdict

def get_matching_words(file: str, centerLetter: str, outsideLetters: str) -> list[str]:
  matches: list[str] = []

  centerLetter = centerLetter.upper()
  outsideLetters = outsideLetters.upper()

  with open(file, "r") as f:
    for line in f.readlines():
      line = line.upper()
      match = re.match(fr"[{outsideLetters}]*[{centerLetter}][{outsideLetters + centerLetter}]*\s", line)

      if not(match is None):
        matches.append(line.strip().upper())
  
    return matches

# Filter words from input file into output file
def filter_words(inputFile: str, outputFile: str):
  with open(inputFile, "r") as f:
    output = open(outputFile, "w")
    
    for line in f.readlines():
      # Ignore:
      # words that have anything other than letters
      # words that start with a capital letter (proper nouns)
      # words < 4 letters long
      match = re.match(r"[a-z][a-zA-Z]{3}[a-zA-z]*\s", line)
      word = line.strip().upper()

      # Filter out words with > 7 different letters since I"m using this data
      # for a spelling bee game, where you only get 7 letters to choose from
      numDifferentLetters = 0
      lettersSeen: list[str] = []
      for letter in word:
         if not(letter in lettersSeen):
            lettersSeen.append(letter)
            numDifferentLetters += 1
      
      # print(f"{word}: {numDifferentLetters}")

      if not(match is None) and numDifferentLetters <= 7:
        output.write(f"{word}\n")

def find_pangrams(file: str, outputFile: str):
  with open(file, 'r') as f:
    output = open(outputFile, 'w')

    for line in f.readlines():
      word = line.strip()
      wordIsPangram = is_pangram(word)
      if wordIsPangram:
        output.write(f'{word}\n')

def is_pangram(word: str) -> bool:
  letters_seen = []
  for letter in word:
    if not(letter in letters_seen):
      letters_seen.append(letter)

  if len(letters_seen) == 7:
    return True
  
  return False

# export function isPangram(word: string): boolean {
#   let lettersSeen: string[] = []
#   for(let letter of word) {
#     if(!lettersSeen.includes(letter)) lettersSeen.push(letter)
#   }

#   if(lettersSeen.length == 7) return true
  
#   return false
# }

if __name__ == "__main__":
  # filter_words("wordlist.txt", "wordlist_filtered.txt")

  # matches = get_matching_words(
  #   "wordlist_filtered.txt",
  #   "N",
  #   "DOCITE"
  # )

  # print(matches, len(matches))

  find_pangrams('wordlist_filtered.txt', 'pangrams.txt')