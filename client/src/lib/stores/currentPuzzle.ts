import type Puzzle from "$backend_interfaces/Puzzle";
import { type DailyPuzzleData, type DailyPuzzleErrors, type ErrorResponse, type GetPuzzleData, type GetPuzzleErrors, type SuccessResponse } from "$backend_interfaces/Response";
import type Loadable from "$lib/types/loadable";
import request from "$lib/utils/requests/request";
import { writable } from "svelte/store";
import { setNotification } from "./notification";

const currentPuzzle = writable<Loadable<Puzzle>>({ loading: true, data: undefined })

// currentPuzzle.subscribe(p => console.log(p))

export const loadNewPuzzle = async (id: string) => {
  currentPuzzle.set({ loading: true, data: undefined })

  const res = await request<{}, SuccessResponse<GetPuzzleData> | ErrorResponse<GetPuzzleErrors>>(`puzzle/get?id=${id}`)
  if(!res.success) {
    setNotification(`Error fetching puzzle with id "${id}"`, res.message, 'error')
    currentPuzzle.set({ loading: false, data: undefined })
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

  const res = await request<{}, SuccessResponse<DailyPuzzleData> | ErrorResponse<DailyPuzzleErrors>>('puzzle/daily')
  if(!res.success) {
    setNotification('Error fetching daily puzzle', res.message, 'error')
    currentPuzzle.set({ loading: false, data: undefined })
    return false
  }
  
  currentPuzzle.set({ 
    loading: false, 
    data: res.data.puzzle
  })

  return true
}


export default currentPuzzle