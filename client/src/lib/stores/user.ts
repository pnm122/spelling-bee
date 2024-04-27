import { writable } from "svelte/store";
import type User from "$shared/interfaces/User";
import getUser from "$lib/utils/requests/auth/getUser";
import type Loadable from "$lib/types/loadable";
import type { UserWordFound } from "$shared/interfaces/Score";
import { isPangram } from "$lib/utils/points";
import type { AuthenticatedErrors, GetUserErrors } from "$shared/interfaces/Response";

type GameUserErrors = GetUserErrors | AuthenticatedErrors
export type GameUser = Loadable<User, GameUserErrors>
let user = writable<GameUser>({ loading: true, data: undefined })

const init = async () => {
  const userRes = await getUser()
  if(userRes.success) user.set({ loading: false, data: userRes.data.user })
  else user.set({ loading: false, data: undefined, error: userRes.message })
}

export const setUser = (u: User) => {
  user.set({ loading: false, data: u })
}

export const removeUser = () => {
  user.set({ loading: false, data: undefined, error: undefined })
}

export const addWordToUser = (word: UserWordFound) => {
  user.update(u => {
    if(u.loading || !u.data) return u
    const { words_found, longest_word, pangrams, points } = u.data.stats

    return {
      ...u,
      data: {
        ...u.data,
        stats: {
          ...u.data.stats,
          words_found: words_found + 1,
          pangrams: isPangram(word.word) ? pangrams + 1 : pangrams,
          points: points + word.points,
          longest_word: word.word.length > longest_word.length ? word.word : longest_word
        }
      }
    }
  })
}

init()

export default user