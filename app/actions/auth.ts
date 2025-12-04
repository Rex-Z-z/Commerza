// app/actions/auth.ts
'use server'

import { cookies } from 'next/headers'

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
    
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || "Login failed" };
    }

    // Extract token from your backend response structure
    // Based on your Java code: ApiResponse contains 'payload', which contains 'token'
    const token = data.payload?.token; 

    if (!token) {
      return { error: "Token not received from server" };
    }

    // Store token in HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
    });

    return { success: true };

  } catch (error) {
    console.error("Login error:", error);
    return { error: "Network error. Please try again." };
  }
}