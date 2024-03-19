import { readable } from "svelte/store";
import type Puzzle from "$backend_interfaces/Puzzle"
import type Loadable from "$lib/types/loadable";

const todaysPuzzle = readable<Loadable<Puzzle>>(
  { loading: true }, 
  // Runs when it gets its first subscriber
  (set) => {
    // id: string
    // centerLetter: string
    // outsideLetters: [string, string, string, string, string, string]
    // wordList: string[]
    // date: string

    set({
      loading: false,
      data: {
        id: 'abcdef',
        centerLetter: 'N',
        outsideLetters: ['M', 'A', 'D', 'O', 'L', 'I'],
        wordList: ['ADMIN', 'AMINO', 'AMMONIA', 'ANAL', 'ANNAL', 'ANIMA', 'ANIMAL', 'DAMN', 'DINO', 'DOMAIN', 'INLAID', 'LAIN', 'LAND', 'LAMINA', 'LAMINAL', 'LIMINA', 'LIMINAL', 'LOAN', 'LOIN', 'MADMAN', 'MAILMAN', 'MAIN', 'MAMMALIAN', 'MANIA', 'MANDOLIN', 'MILLION', 'MINIMA', 'MINIMAL', 'MOAN', 'MONOMIAL', 'MOON', 'NAIL', 'NOMAD', 'OILMAN'],
        date: '03/18/2024'
      }
    })
  }
)

export default todaysPuzzle