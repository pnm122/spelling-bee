import type { DailyPuzzleData, DailyPuzzleErrors, ErrorResponse, SuccessResponse } from "$shared/interfaces/Response";
import request from "../request";

export default async function getTodaysPuzzle(): Promise<SuccessResponse<DailyPuzzleData> | ErrorResponse<DailyPuzzleErrors> | ErrorResponse<'unknown-error'>> {
  const res = await request<{}, SuccessResponse<DailyPuzzleData> | ErrorResponse<DailyPuzzleErrors>>('puzzle/daily')
  return res
}