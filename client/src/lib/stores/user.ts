import { writable } from "svelte/store";
import type User from "$backend_interfaces/User";
import getUser from "$lib/utils/requests/auth/getUser";
import type Loadable from "$lib/types/loadable";
import type { UserWordFound } from "$backend_interfaces/Score";
import { isPangram } from "$lib/utils/points";

let user = writable<Loadable<User>>({ loading: true, data: undefined })

user.subscribe(u => {
  console.log(u)
})

const init = async () => {
  const userRes = await getUser()
  user.set({ loading: false, data: userRes?.user })
}

export const setUser = (u: User) => {
  user.set({ loading: false, data: u })
}

export const removeUser = () => {
  user.set({ loading: false, data: undefined })
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