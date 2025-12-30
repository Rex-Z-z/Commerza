import React from 'react'
import { getProductDetailsAction } from '@/app/actions/product'
import ProductDetailsClient from './product-details-client'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode' // Install via: npm install jwt-decode

export default async function Page({ params }: { params: Promise<{ uuid: string }> }) {
    const { uuid } = await params;
    const { payload, error } = await getProductDetailsAction(uuid);

    // Get the session token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    
    let currentUser = null;
    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            currentUser = {
                email: decoded.sub, // The email from your JWT payload
                token: token
            };
        } catch (e) {
            console.error("Token decoding failed", e);
        }
    }

    if (error || !payload) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
                <p className="text-gray-500">We couldn't find the product with ID: {uuid}</p>
            </div>
        )
    }

    return (
        <main className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Now passing the authenticated user */}
                <ProductDetailsClient product={payload} currentUser={currentUser} />
                
                <div className="mt-16 border-t pt-10">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Product Description</h2>
                    <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                        {payload.description}
                    </div>
                </div>
            </div>
        </main>
    )
}