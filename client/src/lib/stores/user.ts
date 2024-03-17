import { writable } from "svelte/store";
import type User from "$backend_interfaces/User";
import getUser from "$lib/utils/getUser";

const userRes = await getUser()

let user = writable<User | undefined>(userRes?.user)

user.subscribe(u => {
  console.log(u)
})

export default user