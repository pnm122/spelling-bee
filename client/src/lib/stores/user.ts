import { writable } from "svelte/store";
import type User from "$backend_interfaces/User";
import getUser from "$lib/utils/getUser";

let user = writable<User | undefined>(undefined)

user.subscribe(u => {
  console.log(u)
})

const init = async () => {
  const userRes = await getUser()
  user.set(userRes?.user)
}

init()

export default user