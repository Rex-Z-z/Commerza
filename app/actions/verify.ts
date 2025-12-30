// app/actions/verify.ts
'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function getPendingVerifications() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${API_URL}/admin/verifications/pending`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store' // Ensure we always get fresh data
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Failed to fetch requests" };
    }

    return { success: true, payload: data.payload };
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: "Failed to connect to server" };
  }
}

export async function approveVerificationAction(verifyUuid: string, remarks: string = "Approved by Super Admin") {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${API_URL}/verify/approve/${verifyUuid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ remarks }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Failed to approve request" };
    }

    // Refresh data on the server path
    revalidatePath('/admin/verifications');
    
    return { success: true, payload: data.payload };

  } catch (error) {
    console.error("Approve error:", error);
    return { error: "Network error occurred" };
  }
}

export async function rejectVerificationAction(verifyUuid: string, remarks: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) return { error: "Unauthorized" };

  try {
    const res = await fetch(`${API_URL}/verify/reject/${verifyUuid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ remarks }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Failed to reject request" };
    }

    // Refresh data on the server path
    revalidatePath('/admin/verifications');

    return { success: true, payload: data.payload };

  } catch (error) {
    console.error("Reject error:", error);
    return { error: "Network error occurred" };
  }
}