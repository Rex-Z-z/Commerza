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

// For Super Admin
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

// For Company Admin: Update Seller Details
export async function updateSellerAction(prevState: any, formData: FormData) {
    const cookieStore = await cookies()
    const token = cookieStore.get('session_token')?.value
    
    const userUuid = formData.get('userUuid') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const status = formData.get('status') as string

    if (!token) return { error: "Unauthorized" }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company-admin/seller/${userUuid}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, status })
        })

        const data = await res.json()

        if (res.ok) {
            revalidatePath('/dashboard/team')
            return { success: true, message: "Seller updated successfully" }
        }
        return { error: data.message || "Failed to update seller" }
    } catch (error: any) {
        return { error: error.message }
    }
}

// For Company Admin: Suspend/Activate
export async function updateSellerStatusAction(userUuid: string, status: string) {
    const cookieStore = await cookies()
    const token = cookieStore.get('session_token')?.value

    if (!token) return { error: "Unauthorized" }

    try {
        // We reuse the update endpoint but only send status
        // Ensure your backend handles null values for firstName/lastName gracefully or fetch current user first.
        // Assuming backend merges changes or ignores nulls:
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company-admin/seller/${userUuid}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status }) 
        })

        if (res.ok) {
            revalidatePath('/dashboard/team')
            return { success: true, message: `Seller ${status === 'active' ? 'activated' : 'suspended'}` }
        }
        return { error: "Failed to update status" }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function deleteUserAction(userUuid: string, role: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value
  
  const endpoint = role === 'admin_company' 
    ? `/company-admin/seller/${userUuid}` 
    : `/admin/users/${userUuid}`

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