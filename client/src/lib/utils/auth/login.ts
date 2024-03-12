import type { SuccessResponse, ErrorResponse } from '$backend_interfaces/Response'
import request from '../request'

export default async function login(
  username: string, 
  password: string
) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL
  
  const res = await request<SuccessResponse | ErrorResponse>(
    `${baseUrl}/api/user/login`,
    'POST',
    {
      username: username,
      password: password
    }
  )

  console.log(res)
}