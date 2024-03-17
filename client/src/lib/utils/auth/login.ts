import type { SuccessResponse, ErrorResponse, LoginErrors, LogInData } from '$backend_interfaces/Response'
import request from '../request'

export default async function login(
  username: string, 
  password: string
) {
  
  const res = await request<SuccessResponse<LogInData> | ErrorResponse<LoginErrors>>(
    'user/login',
    'POST',
    {
      username: username,
      password: password
    }
  )

  return res
}