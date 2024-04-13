import type { LevelColors, LevelColorsWithMinLevel, LevelProgress } from "$lib/types/levels";

export const minPointsPerLevel = [
  0, 100, 250, 
  400, 650, 900, 
  1150, 1400, 1700, 
  2000, 2300, 2600, 
  3000, 3400, 3800, 
  4200, 4600, 5000,
  5500, 6000, 6500,
  7100, 7700, 8300,
  9000, 9700, 10400,
  11200, 12000, 12800,
  14000, 17500, 20000
]

export const colors: LevelColorsWithMinLevel[] = [{
  minLevel: -1,
  bgColor: "var(--level-1)",
  textColor: "var(--dark)"
}, {
  minLevel: 4,
  bgColor: "var(--level-2)",
  textColor: "var(--dark)"
}, {
  minLevel: 7,
  bgColor: "var(--level-3)",
  textColor: "var(--dark)"
}, {
  minLevel: 10,
  bgColor: "var(--level-4)",
  textColor: "var(--dark)"
}, {
  minLevel: 13,
  bgColor: "var(--level-5)",
  textColor: "var(--dark)"
}, {
  minLevel: 16,
  bgColor: "var(--level-6)",
  textColor: "var(--bg)"
}, {
  minLevel: 19,
  bgColor: "var(--level-7)",
  textColor: "var(--bg)"
}, {
  minLevel: 22,
  bgColor: "var(--level-8)",
  textColor: "var(--dark)"
}, {
  minLevel: 25,
  bgColor: "var(--level-9)",
  textColor: "var(--bg)"
}, {
  minLevel: 28,
  bgColor: "var(--level-10)",
  textColor: "var(--bg)"
}, {
  minLevel: 31,
  bgColor: "var(--level-11)",
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