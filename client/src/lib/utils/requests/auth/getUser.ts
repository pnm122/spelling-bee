import type { ErrorResponse, GetUserData, GetUserErrors, SuccessResponse } from "$shared/interfaces/Response";
import request from "../request";
import Cookies from "js-cookie";

export default async function getUser(): Promise<GetUserData | undefined> {
  const session = Cookies.get('session')
  if(!session) return undefined

  const res = await request<{}, SuccessResponse<GetUserData> | ErrorResponse<GetUserErrors>>('user/get_user')

  if(!res.success) return undefined

  return res.data
}