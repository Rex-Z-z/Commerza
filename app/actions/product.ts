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

export async function getAllProductsAction(page: number = 1, size: number = 50) {
  try {
    // Note: Targeted 'public' endpoint as per your previous code. 
    // If you need the seller's specific products, you might need a different endpoint with Auth headers.
    const res = await fetch(`${API_URL}/products/public?page=${page}&size=${size}`, {
      cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Failed to fetch products" };
    }

    return { payload: data.payload };
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return { error: "Network error while fetching products" };
  }
}

export async function getAllBrandsAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // ✅ Fix: Append the Bearer token to the headers
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/products/all-brand`, {
      method: 'GET',
      headers: headers,
      cache: 'no-store', // Ensure fresh data
    })

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to fetch brands:", errorText);
      return { error: 'Failed to fetch brands', payload: [] }
    }
    
    const data = await res.json()
    
    // Based on your API response, the list is in 'payload'
    return { payload: data.payload || [] } 
  } catch (error: any) {
    console.error("Error in getAllBrandsAction:", error)
    return { error: error.message, payload: [] }
  }
}

  export async function getPublicProducts(page: number = 1, size: number = 10) {
    try {
      const res = await fetch(`${API_URL}/products/public?page=${page}&size=${size}`, {
        cache: 'no-store'
      });
      const data = await res.json();
      if (!res.ok) {
        return null;
      }
      return data.payload;
    } catch (error) {
      console.error("Error fetching public products:", error);
      return null;
    }
  }
  

  // ... (keep existing code)

export async function getProductDetailsAction(uuid: string) {
  try {
    const res = await fetch(`${API_URL}/products/public/${uuid}`, {
      cache: 'no-store' // Detailed info should be fresh
    });
    const data = await res.json();
    if (!res.ok) return { error: data.message || "Failed to fetch product" };
    return { payload: data.payload };
  } catch (error) {
    return { error: "Network error" };
  }
}
