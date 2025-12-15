'use server'

import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function uploadImagesAction(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    return { error: "Unauthorized: No session token found" };
  }

  try {
    const res = await fetch(`${API_URL}/storage/uploads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Note: Do NOT set Content-Type for FormData; fetch sets it with boundary automatically
      },
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Image upload failed" };
    }

    return { payload: data.payload };
  } catch (error) {
    console.error("Upload Error:", error);
    return { error: "Network error during upload" };
  }
}

export async function createProductAction(productData: any) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Product creation failed" };
    }

    return { success: true, payload: data.payload };
  } catch (error) {
    console.error("Create Product Error:", error);
    return { error: "Network error during product creation" };
  }
}