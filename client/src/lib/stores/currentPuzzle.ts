import type Puzzle from "$backend_interfaces/Puzzle";
import { type DailyPuzzleData, type DailyPuzzleErrors, type ErrorResponse, type GetPuzzleData, type GetPuzzleErrors, type SuccessResponse } from "$backend_interfaces/Response";
import type Loadable from "$lib/types/loadable";
import request from "$lib/utils/requests/request";
import { get, writable } from "svelte/store";
import { setNotification } from "./notification";
import { getTotalPoints } from "$lib/utils/points";

const currentPuzzle = writable<Loadable<Puzzle>>({ loading: true, data: undefined })

export const loadNewPuzzle = async (id: string) => {
  currentPuzzle.set({ loading: true, data: undefined })

  const res = await request<SuccessResponse<GetPuzzleData> | ErrorResponse<GetPuzzleErrors>>(`/puzzle/${id}`)
  if(!res.success) {
    setNotification(`Error fetching puzzle with id "${id}"`, res.message)
    currentPuzzle.set({ loading: false, data: undefined })
    return
  }
  
  currentPuzzle.set({ 
    loading: false, 
    data: res.data.puzzle
  })
}

export const loadDailyPuzzle = async () => {
  currentPuzzle.set({ loading: true, data: undefined })

  const res = await request<SuccessResponse<DailyPuzzleData> | ErrorResponse<DailyPuzzleErrors>>('puzzle/daily')
  if(!res.success) {
    setNotification('Error fetching daily puzzle', res.message)
    currentPuzzle.set({ loading: false, data: undefined })
    return
  }
  
  currentPuzzle.set({ 
    loading: false, 
    data: res.data.puzzle
  })
  console.log(res.data.puzzle)
}

currentPuzzle.subscribe(c => {
  console.log(c)
})

export default currentPuzzle