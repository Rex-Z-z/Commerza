'use client'

import { ColumnDef } from "@tanstack/react-table"
import { ArrowRight, ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VisaIcon, MastercardIcon, PayPalIcon, KHQRIcon } from "@/components/icons/custom-icon"

export type Order = {
    id: string
    user: {
        name: string
        email: string
        avatar?: string
    }
    productName: string
    date: string
    quantity: number
    totalAmount: number
    status: "Completed" | "Pending" | "Canceled"
    paymentMethod: "Credit Card" | "PayPal" | "Bank Transfer"
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Approximate month (30 days) in milliseconds
    const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;

    // Only show relative time if within the last 30 days
    if (diff < oneMonthInMs && diff >= 0) {
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return "Just now";
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }

    // Default format for older dates
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    }).format(date);
}

export const columns: ColumnDef<Order>[] = [
    {
        accessorKey: "user.name",
        id: "user",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8">
                    Customer
                    {column.getIsSorted() === "asc" ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ChevronDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => {
            const customer = row.original.user
            return (
                <div className="ml-3 flex items-center gap-3">
                    <Avatar className="h-9 w-9 rounded-lg">
                        <AvatarImage src={customer.avatar} alt={customer.name} />
                        <AvatarFallback className="rounded-lg">
                            {customer.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{customer.name}</span>
                        <span className="text-xs text-gray-400">{customer.email}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "productName",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-3 h-8">
                    Product Name
                    {column.getIsSorted() === "asc" ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ChevronDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("productName")}</div>
    },
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-3 h-8">
                    Date
                    {column.getIsSorted() === "asc" ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ChevronDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => {
            const dateStr = row.getValue("date") as string
            return <div className="text-gray-500 min-w-[100px]">{formatDate(dateStr)}</div>
        },
    },
    {
        accessorKey: "quantity",
        header: "Qty",
        cell: ({ row }) => <div className="text-center mr-6">{row.getValue("quantity")}</div>
    },
    {
        accessorKey: "totalAmount",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-3 h-8">
                    Total Amount
                    {column.getIsSorted() === "asc" ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ChevronDown className="ml-2 h-4 w-4" />
                    ) : (
                        <ChevronsUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalAmount"))
            const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", }).format(amount)
            return <div className="font-medium w-16 truncate" title={formatted}>{formatted}</div>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as Order["status"]
            const variantMap = {
                "Completed": "bg-green-100 text-green-500 hover:bg-green-100/80",
                "Pending": "bg-orange-100 text-orange-500 hover:bg-orange-100/80",
                "Canceled": "bg-red-100 text-red-500 hover:bg-red-100/80",
            }
            
            return (
                <Badge className={`${variantMap[status]} border-none shadow-none`}>
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment",
        cell: ({ row }) => {
            const method = row.getValue("paymentMethod") as string
            const paymentIcons: Record<string, React.ReactNode> = {
                "Credit Card": (
                    <div className="flex flex-row gap-1">
                    <VisaIcon className="size-6 text-blue-900" />
                    <MastercardIcon className="size-6 text-red-800" />
                    </div>
                ),
                "PayPal": <PayPalIcon className="size-3.5" />,
                "Bank Transfer": <KHQRIcon className="size-7.5 text-red-500" />,
            }
            
            return (
                <div className="flex flex-row items-center gap-1.5 text-gray-500">
                    {paymentIcons[method]}
                    <span>{method}</span>
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <span className="sr-only">View Details</span>
                </Button>
            )
        },
    },
]