import type { LevelColors, LevelColorsWithMinLevel, LevelProgress } from "$lib/types/levels";

export const minPointsPerLevel = [0, 100, 250, 400, 600, 900, 1300, 2000, 3000, 5000]

export const colors: LevelColorsWithMinLevel[] = [{
  minLevel: -1,
  bgColor: "var(--primary)",
  textColor: "var(--dark)"
}, {
  minLevel: 4,
  bgColor: "var(--level-middle)",
  textColor: "var(--light)"
}, {
  minLevel: 7,
  bgColor: "var(--accent)",
  textColor: "var(--light)"
}, {
  minLevel: 10,
  bgColor: "var(--heading)",
  textColor: "var(--bg)"
}]

/** 
* Convert player's points to their level and progress to the next level
* @param {number} points - Points the player has earned
* @return {LevelProgress} Progress within level. pointsToNextLevel = 0 and totalPointsInLevel = pointsEarnedInLevel if level is maxed out
*/
export function pointsToLevel(points: number): LevelProgress {
  if(points < 0) {
    console.error('pointsToLevel: Points cannot be negative')
    return {
      level: -1,
      pointsEarnedInLevel: -1,
      pointsToNextLevel: -1,
      totalPointsInLevel: -1
    }
  }

  for(let i = minPointsPerLevel.length - 1; i >= 0; i--) {
    if(points >= minPointsPerLevel[i]) {
      let pointsEarnedInLevel = points - minPointsPerLevel[i]
      let pointsToNextLevel = i == minPointsPerLevel.length - 1
                                ? 0
                                : minPointsPerLevel[i + 1] - points
      let totalPointsInLevel = pointsEarnedInLevel + pointsToNextLevel

      return {
        level: i + 1,
        pointsEarnedInLevel,
        pointsToNextLevel,
        totalPointsInLevel
      }
    }
  }

  console.error('getCurrentLevelProgress: ???')
  return {
    level: -1,
    pointsEarnedInLevel: -1,
    pointsToNextLevel: -1,
    totalPointsInLevel: -1
  }
}

/** 
* Get the UI colors for a given level
* @param {number} level - Player's level
* @return {LevelColors} Background and text color to use for the level
*/
export function levelToColors(level: number): LevelColors {
  for(let i = colors.length - 1; i >= 0; i--) {
    if(level >= colors[i].minLevel) {
      const { minLevel, ...levelColors } = colors[i]
      return levelColors
    }
  }

  // Unknown level
  return {
    bgColor: "var(--gray)",
    textColor: "var(--darkgray)"
  }
}