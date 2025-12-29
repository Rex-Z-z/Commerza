import React from 'react'
import { getProductDetailsAction } from '@/app/actions/product'
import ProductDetailsClient from './product-details-client'

// In Next.js 15, params is a Promise
export default async function Page({ params }: { params: Promise<{ uuid: string }> }) {
    // 1. Await the params to get the uuid
    const { uuid } = await params;

    // 2. Fetch data using the server action
    const { payload, error } = await getProductDetailsAction(uuid);

    // 3. Handle error/not found states
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
                {/* Pass the payload to your client component */}
                <ProductDetailsClient product={payload} />
                
                {/* Description Section */}
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