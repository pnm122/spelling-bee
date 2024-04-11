import type { AllPuzzlesResponse } from "$shared/interfaces/Response";
import { setNotification } from "$lib/stores/notification";
import request from "../request";

export default async function getAllPuzzles(): Promise<AllPuzzlesResponse> {
  const res = await request<{}, AllPuzzlesResponse>('puzzle/all')

  if(!res.success && res.message == 'unknown-error') {
    setNotification(
      'Error',
      'Failed to get all puzzles, please refresh to try again.',
      'error'
    )
  }

  return res
}