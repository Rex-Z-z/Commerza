import React from 'react'
import CreateProductForm from '../components/create-product-form'
import Link from 'next/link'
import { cookies } from 'next/headers'

// Mock fetching categories - replace with your actual API call logic
async function getCategories() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
  // You might need to pass headers/tokens here if this endpoint is protected
  try {
      const res = await fetch(`${apiUrl}/categories/main`, { cache: 'no-store' })
      if (!res.ok) return []
      const data = await res.json()
      return data.payload || []
  } catch (e) {
      return []
  }
}

export default async function CreateProductPage() {
  const categories = await getCategories()

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Create New Product</h1>
        <p className="text-muted-foreground">
          Add a new product with variants (e.g. Size, Color) and images.
        </p>
      </div>
      <div className="max-w-5xl">
         <CreateProductForm mainCategories={categories} />
      </div>
    </div>
  )
}