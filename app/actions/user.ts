// app/actions/user.ts
'use server'

import { cookies } from 'next/headers'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  if (!token) return null

  try {
    // Call your Spring Boot endpoint
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store' // Ensure we always get fresh data
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.payload // Returns the User object with UserProfile
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return null
  }
}