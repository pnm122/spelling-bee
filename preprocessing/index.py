# https://github.com/dwyl/english-words/blob/master/words.txt

import re
import gzip
from collections import defaultdict

# Credit: Professor Lorraine Li at University of Pittsburgh
# CS1671 Spring 2024 Assignment 2
def load_ngram_counts(ngram_counts_file):
    counts = defaultdict(int)
    with gzip.open(ngram_counts_file, "rt", encoding="utf-8") as f:
        for line in f:
            token, count = line.strip().split("\t")
            if token[0].islower():
                counts[token] = int(count)
    return counts

def getMatchingWords(file: str, centerLetter: str, outsideLetters: str) -> list[str]:
  matches: list[str] = []

  centerLetter = centerLetter.lower()
  outsideLetters = outsideLetters.lower()

  with open(file, 'r') as f:
    for line in f.readlines():
      match = re.match(fr'[{outsideLetters}]*[{centerLetter}][{outsideLetters}]*\s', line)

      if not(match is None):
        matches.append(line.strip())
  
    return matches

# Filter words from input file into output file
# Use ngram_counts to filter out words below a given threshold of commonness
# Not perfect -- includes words that I wouldn't consider to be words but it's better than nothing
def filterWords(inputFile: str, outputFile: str, ngram_counts: dict, filterThreshold: int):
  with open(inputFile, 'r') as f:
    output = open(outputFile, 'w')
    
    for line in f.readlines():
      # Ignore:
      # words that have anything other than letters
      # words that start with a capital letter (proper nouns)
      # words < 4 letters long
      match = re.match(r'[a-z][a-zA-Z]{3}[a-zA-z]*\s', line)
      word = line.strip().lower()
      counts = ngram_counts[word]

      # Filter out words with > 7 different letters since I'm using this data
      # for a spelling bee game, where you only get 7 letters to choose from
      numDifferentLetters = 0
      lettersSeen: list[str] = []
      for letter in word:
         if not(letter in lettersSeen):
            lettersSeen.append(letter)
            numDifferentLetters += 1
      
      # print(f'{word}: {numDifferentLetters}')

      if not(match is None) and counts > filterThreshold and numDifferentLetters <= 7:
        output.write(f'{word}\n')

if __name__ == '__main__':
  matches = getMatchingWords(
    'output.txt',
    'R',
    'UWIPNG'
  )

  print(matches)

  # ngram_counts = load_ngram_counts('ngram_counts.txt.gz')

  # filterWords(
  #   'words.txt',
  #   'output.txt',
  #   ngram_counts,
  #   10000
  # )