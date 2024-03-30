export default interface Progress {
  maxPoints: number,
  points: number,
  wordsFound: string[],
  pointsFromLastWord: number
}