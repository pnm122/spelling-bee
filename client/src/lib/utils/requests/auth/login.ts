import type { SuccessResponse, ErrorResponse, LoginErrors, LogInData } from '$shared/interfaces/Response'
import type { LoginRequest } from '$shared/interfaces/User'
import { setUser } from '$lib/stores/user'
import request from '../request'

export default async function login(
  username: string, 
  password: string
) {
  
  const res = await request<LoginRequest, SuccessResponse<LogInData> | ErrorResponse<LoginErrors>>(
    'user/login',
    'POST',
    {
      username: username,
      password: password
    }
  )

  // Update the user store on successful login
  // This will automatically redirect them from the login page
  if(res.success) setUser(res.data.user)

  return res
}