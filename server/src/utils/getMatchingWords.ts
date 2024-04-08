export default function getMatchingWords(
  wordList: string[],
  centerLetter: string,
  outsideLetters: string[]
): string[] {
  let matches: string[] = []
  let outsideLettersString = outsideLetters.join('')
  const regex = new RegExp(`^[${outsideLettersString + centerLetter}]*[${centerLetter}][${outsideLettersString + centerLetter}]*$`)

  for(let word of wordList) {
    const match = word.match(regex)
    if(match) {
      matches.push(word)
    }
  }

  return matches
}

// def get_matching_words(file: str, centerLetter: str, outsideLetters: str) -> list[str]:
//   matches: list[str] = []

//   centerLetter = centerLetter.upper()
//   outsideLetters = outsideLetters.upper()

//   with open(file, "r") as f:
//     for line in f.readlines():
//       line = line.upper()
//       match = re.match(fr"[{outsideLetters}]*[{centerLetter}][{outsideLetters + centerLetter}]*\s", line)

//       if not(match is None):
//         matches.append(line.strip().upper())
  
//     return matches