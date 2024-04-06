import type { SuccessResponse, ErrorResponse, SignUpData, SignUpErrors } from '$backend_interfaces/Response'
import type { SignupRequest } from '$backend_interfaces/User'
import { setUser } from '$lib/stores/user'
import request from '../request'

export default async function signup(
  username: string, 
  password: string
) {
  
  const res = await request<SignupRequest, SuccessResponse<SignUpData> | ErrorResponse<SignUpErrors>>(
    'user/signup',
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