import React from 'react'
import { columns, Product } from "./components/columns-product"
import { DataTable } from './components/data-table';

async function getData(): Promise<Product[]> {
    return [
        {
            id: "1",
            name: "Wireless Bluetooth Earbuds",
            price: 29.99,
            category: "Electronics",
            rating: 4.1,
            monthlySales: 1572,
            status: "Active"
        },
        {
            id: "2",
            name: "Ergonomic Office Chair",
            price: 149.0,
            category: "Furniture",
            rating: 3.8,
            monthlySales: 214,
            status: "Active"
        },
        {
            id: "3",
            name: "Stainless Steel Water Bottle 1L",
            price: 18.5,
            category: "Home & Kitchen",
            rating: 4.9,
            monthlySales: 1086,
            status: "Active"
        },
        {
            id: "4",
            name: "4K Ultra HD Smart TV — 55 inch",
            price: 449.99,
            category: "Electronics",
            rating: 2.7,
            monthlySales: 93,
            status: "Pending"
        },
        {
            id: "5",
            name: "Running Shoes (Men)",
            price: 69.95,
            category: "Sportswear",
            rating: 3.2,
            monthlySales: 634,
            status: "Inactive"
        },
        {
            id: "6",
            name: "LED Desk Lamp with USB Port",
            price: 24.99,
            category: "Home & Office",
            rating: 4.4,
            monthlySales: 372,
            status: "Active"
        },
        {
            id: "7",
            name: "Cotton T-Shirt (Pack of 3)",
            price: 22.99,
            category: "Clothing",
            rating: 1.9,
            monthlySales: 815,
            status: "Active"
        },
        {
            id: "8",
            name: "Portable Power Bank 20,000mAh",
            price: 35.0,
            category: "Electronics",
            rating: 5.0,
            monthlySales: 421,
            status: "Inactive"
        },
        {
            id: "9",
            name: "Non-stick Frying Pan 28cm",
            price: 27.5,
            category: "Kitchen",
            rating: 3.5,
            monthlySales: 289,
            status: "Active"
        },
        {
            id: "10",
            name: "Mechanical Keyboard (RGB)",
            price: 79.99,
            category: "Computer Accessories",
            rating: 4.8,
            monthlySales: 156,
            status: "Active"
        },
        {
            id: "11",
            name: "Yoga Mat (10mm Thick)",
            price: 19.99,
            category: "Fitness",
            rating: 2.4,
            monthlySales: 962,
            status: "Suspended"
        },
        {
            id: "12",
            name: "Pet Grooming Brush",
            price: 12.49,
            category: "Pet Supplies",
            rating: 3.1,
            monthlySales: 187,
            status: "Inactive"
        }
    ];
}

const page = async () => {
    const data = await getData()

    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-2xl font-bold tracking-tight">All Product</h1>
            <DataTable columns={columns} data={data} />
        </div>
    )
}

export default page
