export interface LevelColors {
  bgColor: string,
  textColor: string
}

export interface LevelColorsWithMinLevel extends LevelColors {
  minLevel: number
}

export interface LevelProgress {
  level: number
  pointsEarnedInLevel: number
  pointsToNextLevel: number
  totalPointsInLevel: number
}