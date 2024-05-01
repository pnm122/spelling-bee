import type { ErrorResponse, GetUserData, GetUserErrors, SuccessResponse } from "$shared/interfaces/Response";
import request from "../request";
import Cookies from "js-cookie";

export default async function getUser(): Promise<SuccessResponse<GetUserData> | ErrorResponse<GetUserErrors>> {
  console.log('Inside getUser')
  const session = Cookies.get('session')
  console.log('Session:', session)
  if(!session) return { success: false, message: 'no-session' }

  const res = await request<{}, SuccessResponse<GetUserData> | ErrorResponse<GetUserErrors>>('user/get_user')

  return res
}