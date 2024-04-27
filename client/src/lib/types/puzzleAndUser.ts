import type Puzzle from "$shared/interfaces/Puzzle";
import type User from "$shared/interfaces/User";
import type Loadable from "./loadable";

export default interface PuzzleAndUser {
  puzzle: Loadable<Puzzle>
  user: Loadable<User>
}