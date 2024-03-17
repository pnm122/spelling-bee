import type { SuccessResponse, ErrorResponse, SignUpData, SignUpErrors } from '$backend_interfaces/Response'
import request from '../request'

export default async function signup(
  username: string, 
  password: string
) {
  
  const res = await request<SuccessResponse<SignUpData> | ErrorResponse<SignUpErrors>>(
    'user/signup',
    'POST',
    {
      username: username,
      password: password
    }
  )

  return res
}