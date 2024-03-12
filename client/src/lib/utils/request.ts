import type Method from "$lib/types/method";

export default async function request<ExpectedResponseType>(url = "", method: Method = 'GET', data?: {}) {
  const res = await fetch(url, {
    method: method,
    credentials: "include",
    headers: data ? {
      "Content-Type": "application/json"
    } : undefined,
    body: data ? JSON.stringify(data) : undefined
  })

  return await res.json() as ExpectedResponseType
}