import type { SuccessResponse, ErrorResponse, LoginErrors, LogInData, LogoutErrors } from '$backend_interfaces/Response'
import { removeUser } from '$lib/stores/user'
import request from '../request'
import Cookies from 'js-cookie'

export default async function logout(): Promise<false | SuccessResponse | ErrorResponse<LogoutErrors>> {
  if(!Cookies.get('session')) {
    return {
      success: false,
      message: 'no-session'
    }
  }

  const res = await request<{}, SuccessResponse | ErrorResponse<LogoutErrors>>(
    'user/logout',
    'POST'
  )

  if(res.success) removeUser()

  return res
}