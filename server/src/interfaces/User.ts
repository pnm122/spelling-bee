import Score from "./Score"

export default interface User {
  username: string
  email: string
  pastScores: Score[]
}