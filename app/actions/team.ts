'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getAllUsersAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  if (!token) return { error: "Unauthorized" }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    })

    const data = await res.json()
    // Check if payload exists, otherwise return empty array
    return { success: true, data: data.payload || [] }
  } catch (error: any) {
    console.error("Get Users Error:", error)
    return { error: "Failed to connect to server" }
  }
}

export async function getCompanySellersAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  if (!token) return { error: "Unauthorized" }

  try {
    // This calls the new endpoint created in Step 1
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company-admin/sellers`, {
      headers: { 'Authorization': `Bearer ${token}` },
      cache: 'no-store'
    })

    const data = await res.json()
    return { success: true, data: data.payload || [] }
  } catch (error: any) {
    console.error("Get Sellers Error:", error)
    return { error: "Failed to fetch sellers" }
  }
}

export async function updateUserStatusAction(userUuid: string, status: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userUuid}/status`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    })
    
    if (res.ok) {
        revalidatePath('/dashboard/team')
        return { success: true, message: "Status updated" }
    }
    return { error: "Failed to update status" }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function deleteUserAction(userUuid: string, role: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value
  
  // Logic to determine endpoint based on who is deleting
  const endpoint = role === 'admin_company' 
    ? `/company-admin/seller/${userUuid}` 
    : `/admin/users/${userUuid}` // Ensure this endpoint exists in AdminController or use status ban

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: "DELETE",
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (res.ok) {
        revalidatePath('/dashboard/team')
        return { success: true, message: "User deleted" }
    }
    return { error: "Failed to delete user" }
  } catch (error: any) {
    return { error: error.message }
  }
}