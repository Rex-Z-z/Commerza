// app/actions/company.ts
'use server'

import { cookies } from 'next/headers'

export async function createCompanyAction(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (!token) {
    return { error: "Authentication required. Please login." };
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

    // We need to reconstruct the FormData to ensure headers are preserved properly
    // when forwarding from Next.js server to Spring Boot
    const backendFormData = new FormData();
    
    // 1. Get the JSON string from the client form data
    const requestJson = formData.get('request');
    if (requestJson) {
        // Spring Boot is strict about Content-Type for @RequestPart
        // We create a Blob with application/json type
        const jsonBlob = new Blob([requestJson as string], { type: 'application/json' });
        backendFormData.append('request', jsonBlob, 'request.json');
    }

    // 2. Get the file
    const logoFile = formData.get('logo');
    if (logoFile && logoFile instanceof File && logoFile.size > 0) {
        backendFormData.append('logo', logoFile);
    }

    const response = await fetch(`${apiUrl}/company`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        // Do NOT set Content-Type here; fetch will set boundary for multipart
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