// app/actions/company.ts
'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

// ... existing imports ...

// Keep your existing createCompanyAction ...
export async function createCompanyAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    return { error: "Authentication required. Please login." };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
    const backendFormData = new FormData();
    
    const requestJson = formData.get('request');
    if (requestJson) {
        const jsonBlob = new Blob([requestJson as string], { type: 'application/json' });
        backendFormData.append('request', jsonBlob, 'request.json');
    }

    const logoFile = formData.get('logo');
    if (logoFile && logoFile instanceof File && logoFile.size > 0) {
        backendFormData.append('logo', logoFile);
    }

    const response = await fetch(`${apiUrl}/company`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: backendFormData,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Failed to create company" };
    }

    return { success: true, data: data };

  } catch (error: any) {
    console.error("Create Company Error:", error);
    return { error: "Network error. Please check your connection." };
  }
}

// --- NEW ACTION: Create Seller ---
export async function createSellerAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    return { error: "Unauthorized. Please login again." };
  }

  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password = formData.get("password");

  // Basic validation
  if (!firstName || !lastName || !email || !password) {
    return { error: "All fields are required." };
  }

  const payload = {
    firstName,
    lastName,
    email,
    password
  };

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
    
    const response = await fetch(`${apiUrl}/company-admin/seller`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Failed to add seller." };
    }

    // Refresh the dashboard or team list page
    revalidatePath('/dashboard/team');

    return { success: true, message: "Seller added successfully!" };

  } catch (error) {
    console.error("Create Seller Error:", error);
    return { error: "Failed to connect to the server." };
  }
}