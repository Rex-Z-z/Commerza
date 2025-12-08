// app/actions/auth.ts
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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

    const token = data.payload?.token; 

    if (!token) {
      return { error: "Token not received from server" };
    }

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

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  if (token) {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
      
      // Call backend to invalidate token version (Logout All)
      await fetch(`${apiUrl}/auth/logout-all`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Backend logout error:", error);
      // Continue to delete cookie even if backend fails
    }
  }

  // Delete the cookie
  cookieStore.delete('session_token');
  
  // Redirect to login page
  redirect('/login');
}