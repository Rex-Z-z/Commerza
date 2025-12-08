// app/actions/user.ts
'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  if (!token) return null

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store' 
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.payload 
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return null
  }
}

export async function updateUserProfile(formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  if (!token) {
    return { success: false, message: "Unauthorized" }
  }

  try {
    // Note: Do not set 'Content-Type': 'multipart/form-data' manually.
    // fetch with FormData automatically sets the correct boundary.
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    const data = await res.json()

    if (!res.ok) {
      return { success: false, message: data.message || "Failed to update profile" }
    }

    // Revalidate the profile page to show new data immediately
    revalidatePath('/dashboard/profile')
    
    return { success: true, message: "Profile updated successfully", payload: data.payload }
  } catch (error) {
    console.error("Update error:", error)
    return { success: false, message: "An error occurred while updating profile" }
  }
}