import React from 'react'
import { columns, Product } from "./components/columns-product"
import { DataTable } from './components/data-table';
import { getAllProductsAction } from '@/app/actions/product'; 

// --- Types from your Backend ---
interface BackendProduct {
    id: number;
    productUuid: string;
    productName: string;
    description: string;
    sellerId: string | null;
    minPrice: number;
    maxPrice: number;
    mainImage: string;
    availableOptions: Record<string, string[]> | null;
    categoryId: number;
    
    // ✅ Backend Fields
    categoryName: string;      // Subcategory from DB (e.g. Furniture)
    mainCategoryName: string;  // Main Category from DB (e.g. Home & Garden)
    
    averageRating: number;
    active: boolean;
}

export default async function ProductPage() {
    const { payload, error } = await getAllProductsAction(1, 50);

    if (error || !payload) {
        console.error("Error fetching products:", error);
        return (
            <div className="flex flex-col gap-5 p-6">
                <h1 className="text-2xl font-bold tracking-tight">Product Listing</h1>
                <div className="text-red-500">Failed to load products.</div>
            </div>
        );
    }

    const backendData: BackendProduct[] = payload;

    // --- MAP Backend Data to UI Data ---
    const data: Product[] = backendData.map((item) => ({
        id: item.productUuid,
        name: item.productName,
        price: item.minPrice || 0,
        
        // ✅ FIX 1: Set 'category' column to show the Subcategory ("Furniture")
        category: item.categoryName || "General", 
        
        // ✅ FIX 2: Set 'subcategory' (text under name) to Main Category ("Home & Garden")
        subcategory: item.mainCategoryName || "Uncategorized", 
        
        rating: item.averageRating || 0, 
        monthlySales: 0,
        status: item.active ? "Active" : "Inactive",
        mainImage: item.mainImage
    }));

    return (
        <div className="flex flex-col gap-5 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Product Listing</h1>
                <span className="text-muted-foreground text-sm">
                    {data.length} Products found
                </span>
            </div>
            
            {/* Render the Table */}
            <DataTable columns={columns} data={data} />
        </div>
    )
}