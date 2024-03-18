import type { LevelColors, LevelColorsWithMinLevel } from "$lib/types/levelColors";

const colors: LevelColorsWithMinLevel[] = [{
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

export default function levelToColors(level: number): LevelColors {
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