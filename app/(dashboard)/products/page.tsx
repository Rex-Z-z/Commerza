"use client"

import React from 'react'
import { Ellipsis, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { columns, Product } from "./components/columns"
import { DataTable } from './components/data-table';

async function getData(): Promise<Product[]> {
    return [
        {
            id: "1",
            name: "Product 1",
            price: 100,
            category: "Category 1",
            rating: 4.5,
            monthlySales: 500,
            status: "Active"
        },
        {
            id: "2",
            name: "Product 2",
            price: 200,
            category: "Category 2",
            rating: 4.5,
            monthlySales: 500,
            status: "Active"
        },
        {
            id: "3",
            name: "Product 3",
            price: 300,
            category: "Category 3",
            rating: 4.5,
            monthlySales: 500,
            status: "Active"
        },
        {
            id: "4",
            name: "Product 4",
            price: 400,
            category: "Category 4",
            rating: 4.5,
            monthlySales: 500,
            status: "Active"
        },
        {
            id: "5",
            name: "Product 5",
            price: 500,
            category: "Category 5",
            rating: 4.5,
            monthlySales: 500,
            status: "Active"
        },
        {
            id: "6",
            name: "Product 6",
            price: 600,
            category: "Category 6",
            rating: 4.5,
            monthlySales: 500,
            status: "Active"
        },
        {
            id: "7",
            name: "Product 7",
            price: 700,
            category: "Category 7",
            rating: 4.5,
            monthlySales: 500,
            status: "Active"
        },
        {
            id: "8",
            name: "Product 8",
            price: 800,
            category: "Category 8",
            rating: 4.5,
            monthlySales: 500,
            status: "Active"
        },
        {
            id: "9",
            name: "Product 9",
            price: 900,
            category: "Category 9",
            rating: 4.5,
            monthlySales: 500,
            status: "Active"
        },
        {
            id: "10",
            name: "Product 10",
            price: 1000,
            category: "Category 10",
            rating: 4.5,
            monthlySales: 500,
            status: "Active"
        },
        {
            id: "11",
            name: "Product 11",
            price: 1100,
            category: "Category 11",
            rating: 4.5,
            monthlySales: 500,
            status: "Active"
        },
        {
            id: "12",
            name: "Product 12",
            price: 1200,
            category: "Category 12",
            rating: 4.5,
            monthlySales: 500,
            status: "Active"
        },
    ]
}

const page = async () => {
    const data = await getData()

    return (
        <div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}

export default page
