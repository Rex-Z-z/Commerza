'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

// Fetch all users (Super Admin only)
export async function getAllUsersAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  if (!token) return { error: "Unauthorized" }

  try {
    // Matches AdminController.java @GetMapping("/users")
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      next: { tags: ['team-users'] } // For cache invalidation
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to fetch users")
    
    return { success: true, data: data.payload }
  } catch (error: any) {
    console.error("Get Users Error:", error)
    return { error: error.message }
  }
}

// Fetch company sellers (Company Admin only)
export async function getCompanySellersAction() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  if (!token) return { error: "Unauthorized" }

  try {
    // WARNING: You must implement this endpoint in your CompanyAdminController.java
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/company-admin/sellers`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      next: { tags: ['team-sellers'] }
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || "Failed to fetch sellers")
    
    return { success: true, data: data.payload }
  } catch (error: any) {
    console.error("Get Sellers Error:", error)
    return { error: error.message }
  }
}

// Suspend/Ban User (Super Admin)
export async function updateUserStatusAction(userUuid: string, status: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value

  try {
    // Matches AdminController.java @PostMapping("/users/{userUuid}/status")
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userUuid}/status`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message)

    revalidatePath('/dashboard/team')
    return { success: true, message: "Status updated" }
  } catch (error: any) {
    return { error: error.message }
  }
}

// Delete User (Super Admin / Company Admin)
export async function deleteUserAction(userUuid: string, role: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session_token')?.value
  
  // Endpoint differs based on role
  // Company Admin -> /company-admin/seller/{uuid}
  // Super Admin -> /admin/users/{uuid} (Assuming you add DELETE to AdminController, or use status=banned)
  
  let endpoint = role === 'admin_company' 
    ? `/company-admin/seller/${userUuid}` 
    : `/user/profile` // Super admin might need a specific delete endpoint

  // If super_admin, we might just ban them via updateUserStatusAction, 
  // but for this example let's assume a delete endpoint exists or we use status.
  
  if (role === 'super_admin') {
      // AdminController doesn't have DELETE, so we'll suspend instead for safety
      return updateUserStatusAction(userUuid, 'banned');
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: "DELETE",
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
    }

    revalidatePath('/dashboard/team')
    return { success: true, message: "User removed" }
  } catch (error: any) {
    return { error: error.message }
  }
}