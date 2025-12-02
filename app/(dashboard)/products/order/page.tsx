import React from 'react'
import { columns, Order } from "./components/columns-order"
import { OrderDataTable } from './components/data-table';

async function getOrders(): Promise<Order[]> {
    return [
        {
            id: "ORD-001",
            customer: { name: "Alice Johnson", email: "alice@example.com" },
            productName: "Wireless Bluetooth Earbuds",
            date: new Date("2023-10-25T14:30:00"),
            quantity: 1,
            totalAmount: 29.99,
            status: "Completed",
            paymentMethod: "Credit Card"
        },
        {
            id: "ORD-002",
            customer: { name: "Mark Smith", email: "mark.s@example.com" },
            productName: "Ergonomic Office Chair",
            date: new Date("2023-10-25T09:15:00"),
            quantity: 2,
            totalAmount: 298.00,
            status: "Pending",
            paymentMethod: "PayPal"
        },
        {
            id: "ORD-003",
            customer: { name: "Chou Seangly", email: "seangly@example.com" },
            productName: "Mechanical Keyboard (RGB)",
            date: new Date("2023-10-24T18:45:00"),
            quantity: 1,
            totalAmount: 79.99,
            status: "Completed",
            paymentMethod: "Bank Transfer"
        },
        {
            id: "ORD-004",
            customer: { name: "Sarah Lee", email: "sarah.lee@example.com" },
            productName: "4K Ultra HD Smart TV",
            date: new Date("2023-10-24T11:20:00"),
            quantity: 1,
            totalAmount: 449.99,
            status: "Canceled",
            paymentMethod: "Credit Card"
        },
        {
            id: "ORD-005",
            customer: { name: "David Chen", email: "david.c@example.com" },
            productName: "Running Shoes (Men)",
            date: new Date("2023-10-23T16:00:00"),
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