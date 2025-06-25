import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchGet(url: string): Promise<any> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`)
  return res.json()
}

export async function fetchPost(url: string, data: any): Promise<any> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`)
  return res.json()
}

export async function fetchPatch(url: string, data: any): Promise<any> {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error(`PATCH ${url} failed: ${res.status}`)
  return res.json()
}

export async function fetchDelete(url: string): Promise<any> {
  const res = await fetch(url, { method: 'DELETE' })
  if (!res.ok) throw new Error(`DELETE ${url} failed: ${res.status}`)
  return res.json()
}
