export interface LevelColors {
  bgColor: string,
  textColor: string
}

export interface LevelColorsWithMinLevel extends LevelColors {
  minLevel: number
}