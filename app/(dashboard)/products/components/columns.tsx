"use client"
 
import { ColumnDef } from "@tanstack/react-table"
import { ChevronsUpDown , MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
export type Product = {
    id: string
    name: string
    price: number
    category: string
    rating: number
    monthlySales: number
    status: "Active" | "Inactive" | "Pending" | "Suspended"
}

export const columns: ColumnDef<Product>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-3 h-8">
                    Name
                    <ChevronsUpDown  />
                </Button>
            )
        },
    },
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-3 h-8">
                    Category
                    <ChevronsUpDown  className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-3 h-8">
                    Price
                    <ChevronsUpDown  className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "rating",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-3 h-8">
                    Rating
                    <ChevronsUpDown  className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "monthlySales",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-3 h-8">
                    Monthly Sales
                    <ChevronsUpDown  className="ml-2 h-4 w-4" />
                </Button>
            )
        },

        cell: ({ row }) => {
            const monthlySales = row.getValue("monthlySales") as Product["monthlySales"]

            const badgeColor = monthlySales < 100 ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"

            return (
                <div className="flex flex-row gap-2">
                    <div className="text-gray-500 w-12 truncate" title={monthlySales.toString() + "$"}>{monthlySales}$</div>
                    <Badge className={`${badgeColor}`}>
                        {monthlySales < 22 ? "4%" : monthlySales < 44 ? "1%" : monthlySales < 66 ? "3%" : monthlySales < 88 ? "8%" : monthlySales < 100 ? "29%" : monthlySales < 122 ? "34%" : monthlySales < 144 ? "45%" : monthlySales < 166 ? "22%" : monthlySales < 188 ? "16%" : monthlySales < 200 ? "56%" : "99%"}
                    </Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-3 h-8">
                    Status
                    <ChevronsUpDown  className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        
        cell: ({ row }) => {
            const status = row.getValue("status") as Product["status"]
            
            const variantMap = {
                "Active": "bg-green-100 text-green-500",    
                "Inactive": "bg-orange-100 text-orange-400",
                "Pending": "bg-gray-100 text-gray-500",
                "Suspended": "bg-red-100 text-red-500"
            }

            return (
                <Badge className={`${variantMap[status]}`}>
                    {status}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original
        
            return (
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                    onClick={() => navigator.clipboard.writeText(payment.id)}
                    >
                    Copy payment ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>View customer</DropdownMenuItem>
                    <DropdownMenuItem>View payment details</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]