import type Puzzle from "$backend_interfaces/Puzzle";
import type User from "$backend_interfaces/User";
import type Loadable from "./loadable";

export default interface PuzzleAndUser {
  puzzle: Loadable<Puzzle>
  user: Loadable<User>
}