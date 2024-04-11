import type Puzzle from "$shared/interfaces/Puzzle";
import { type AuthenticatedErrors, type AuthenticatedResponse, type DailyPuzzleErrors, type ErrorResponse, type GetPuzzleData, type GetPuzzleErrors, type SuccessResponse } from "$shared/interfaces/Response";
import type Loadable from "$lib/types/loadable";
import request from "$lib/utils/requests/request";
import { writable } from "svelte/store";
import getTodaysPuzzle from "$lib/utils/requests/puzzle/getTodaysPuzzle";

type CurrentPuzzleErrors = GetPuzzleErrors | DailyPuzzleErrors | AuthenticatedErrors
export type CurrentPuzzle = Loadable<Puzzle, CurrentPuzzleErrors>
const currentPuzzle = writable<CurrentPuzzle>({ loading: true, data: undefined })

// currentPuzzle.subscribe(p => console.log(p))

export const loadNewPuzzle = async (id: string) => {
  currentPuzzle.set({ loading: true, data: undefined })

  const res = await request<{}, SuccessResponse<GetPuzzleData> | ErrorResponse<GetPuzzleErrors> | AuthenticatedResponse>(`puzzle/get?id=${id}`)
  if(!res.success) {
    currentPuzzle.set({ 
      loading: false, 
      data: undefined,
      error: res.message
    })
    return false
  }
  
  currentPuzzle.set({ 
    loading: false, 
    data: res.data.puzzle
  })

  return true
}

export const loadDailyPuzzle = async () => {
  currentPuzzle.set({ loading: true, data: undefined })
  const res = await getTodaysPuzzle()
  if(!res.success) {
    currentPuzzle.set({
      loading: false,
      data: undefined,
      error: res.message
    })
    return false
  }
  
  currentPuzzle.set({ 
    loading: false, 
    data: res.data.puzzle
  })

  return true
}


export default currentPuzzle