import type Method from "$lib/types/method";

export default async function request<ExpectedResponseType>(route = "", method: Method = 'GET', data?: {}): Promise<ExpectedResponseType | false> {
  try {
    const baseUrl = import.meta.env.VITE_BACKEND_URL
  
    const res = await fetch(`${baseUrl}/${route}`, {
      method: method,
      credentials: "include",
      headers: data ? {
        "Content-Type": "application/json"
      } : undefined,
      body: data ? JSON.stringify(data) : undefined
    })

    return await res.json() as ExpectedResponseType
  } catch {
    return false
  }
}