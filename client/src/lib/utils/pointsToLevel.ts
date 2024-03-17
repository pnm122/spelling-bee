const minPointsPerLevel = [0, 100, 250, 400, 600, 900, 1300, 2000, 3000, 5000]

// Convert a user's points to a level
export default function pointsToLevel(points: number) {
  if(points < 0) {
    console.error('pointsToLevel: Points cannot be negative')
    return
  }

  for(let i = minPointsPerLevel.length - 1; i >= 0; i--) {
    if(points >= minPointsPerLevel[i]) return i + 1
  }
}