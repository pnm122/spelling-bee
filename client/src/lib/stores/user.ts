import type User from "$lib/types/user";
import { writable } from "svelte/store";

let user = writable<User | null>(null)

user.subscribe(u => {
  console.log(u)
})

export default user