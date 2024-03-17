import { writable } from "svelte/store";
import type User from "$backend_interfaces/User";
import getUser from "$lib/utils/getUser";
import type Loadable from "$lib/types/loadable";

let user = writable<Loadable<User>>({ loading: true })

user.subscribe(u => {
  console.log(u)
})

const init = async () => {
  const userRes = await getUser()
  user.set({ loading: false, data: userRes?.user })
}

init()

export default user