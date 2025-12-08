import React from 'react'
import { columns, Order } from "./components/columns-order"
import { OrderDataTable } from './components/data-table';

async function getOrders(): Promise<Order[]> {
    // Current date for reference: Dec 2, 2025
    return [
        {
            id: "ORD-001",
            user: { name: "Alice Johnson", email: "alice@example.com" },
            productName: "Wireless Bluetooth Earbuds",
            // Less than an hour ago
            date: "2025-12-02T11:45:00", 
            quantity: 1,
            totalAmount: 29.99,
            status: "Completed",
            paymentMethod: "Credit Card"
        },
        {
            id: "ORD-002",
            user: { name: "Mark Smith", email: "mark.s@example.com" },
            productName: "Ergonomic Office Chair",
            // A few hours ago
            date: "2025-12-02T08:15:00",
            quantity: 2,
            totalAmount: 298.00,
            status: "Pending",
            paymentMethod: "PayPal"
        },
        {
            id: "ORD-003",
            user: { name: "Chou Seangly", email: "seangly@example.com" },
            productName: "Mechanical Keyboard (RGB)",
            // Yesterday
            date: "2025-12-01T18:45:00",
            quantity: 1,
            totalAmount: 79.99,
            status: "Completed",
            paymentMethod: "Bank Transfer"
        },
        {
            id: "ORD-004",
            user: { name: "Sarah Lee", email: "sarah.lee@example.com" },
            productName: "4K Ultra HD Smart TV",
            // A week ago
            date: "2025-11-25T11:20:00",
            quantity: 1,
            totalAmount: 449.99,
            status: "Canceled",
            paymentMethod: "Credit Card"
        },
        {
            id: "ORD-005",
            user: { name: "David Chen", email: "david.c@example.com" },
            productName: "Running Shoes (Men)",
            // Older than 30 days (Oct 2025)
            date: "2025-10-23T16:00:00",
            quantity: 1,
            totalAmount: 69.95,
            status: "Completed",
            paymentMethod: "Credit Card"
        },
    ];
}

const OrderPage = async () => {
    const data = await getOrders()

    return (
        <div className="flex flex-col gap-5">
            <h1 className="text-2xl font-bold tracking-tight">Order History</h1>
            <OrderDataTable columns={columns} data={data} />
        </div>
    )
}

export default OrderPage