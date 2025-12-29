import { getProductDetailsAction } from '@/app/actions/product'
import ProductDetailsClient from './product-details-client'

// Ensure params is treated as a Promise in Next.js 15
export default async function Page({ params }: { params: Promise<{ uuid: string }> }) {
    const { uuid } = await params;
    const { payload, error } = await getProductDetailsAction(uuid);

    if (error || !payload) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Product Not Found</h1>
                <p className="text-gray-500">The product ID {uuid} does not exist.</p>
            </div>
        );
    }

    return (
        <main className="bg-white min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <ProductDetailsClient product={payload} />
            </div>
        </main>
    );
}