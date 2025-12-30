'use client'

import { ColumnDef } from "@tanstack/react-table"
import { ChevronsUpDown, ChevronUp, ChevronDown, MoreHorizontal, Eye, Pencil, Trash, Package, } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Rating } from "@/components/ui/rating"

export type Product = {
    id: string
    name: string
    price: number
    category: string
    subcategory: string
    rating: number
    monthlySales: number
    status: "Active" | "Inactive" | "Pending" | "Suspended"
    mainImage?: string 
}

export const columns: ColumnDef<Product>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8">
                    Name
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
            const name = row.getValue("name") as string
            const subcategory = row.original.subcategory
            // ✅ Get image URL
            const imageUrl = row.original.mainImage 

            return (
                <div className="ml-3 flex items-center gap-3">
                    <Avatar className="h-9 w-9 rounded-lg border">
                        {/* ✅ Use src attribute here */}
                        <AvatarImage src={imageUrl} alt={name} className="object-cover" />
                        <AvatarFallback className="rounded-lg">
                            <Package className="size-4.5 text-gray-400"/>
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <div className="font-medium">{name}</div>
                        <div className="text-xs text-gray-400 font-medium">{subcategory}</div>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "category",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-3 h-8">
                    Category
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
            const category = row.getValue("category") as string
            return (
                <div className="w-28 truncate" title={category}>{category}</div>
            )
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-3 h-8">
                    Price
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
            const price = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", }).format(price)
            return (
                <div className="text-gray-500 w-16 truncate" title={formatted}>{formatted}</div>
            )
        },
    },
    {
        accessorKey: "rating",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-3 h-8">
                    Rating
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
            return (
                <div className="min-w-[130px]">
                    <Rating size="sm" rating={row.getValue("rating")} showValue={true} className="text-yellow-500 size-4.5" />
                </div>
            )
        },
    },
    {
        accessorKey: "monthlySales",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-3 h-8">
                    Monthly Sales
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
            const monthlySales = parseFloat(row.getValue("monthlySales"))
            const formatted = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", }).format(monthlySales)
            const badgeColor = monthlySales < 100 ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"

            return (
                <div className="flex flex-row gap-2">
                    <div className="text-gray-500 w-18 truncate" title={formatted}>{formatted}</div>
                    <Badge className={`${badgeColor} hover:${badgeColor}`}>
                        {monthlySales === 0 ? "New" : (monthlySales < 100 ? "Low" : "High")}
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
            const status = row.getValue("status") as Product["status"]
            
            const variantMap = {
                "Active": "bg-green-100 text-green-500 hover:bg-green-100",    
                "Inactive": "bg-orange-100 text-orange-400 hover:bg-orange-100",
                "Pending": "bg-gray-100 text-gray-500 hover:bg-gray-100",
                "Suspended": "bg-red-100 text-red-500 hover:bg-red-100"
            }

            return (
                <Badge className={`${variantMap[status] || variantMap["Pending"]}`}>
                    {status}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="text-gray-500" align="end">
                        <DropdownMenuLabel className="text-black">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="justify-between cursor-pointer">
                            View
                            <Eye className="mr-2 h-4 w-4"/>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="justify-between cursor-pointer">
                            Edit
                            <Pencil className="mr-2 h-4 w-4"/>
                        </DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                    className="justify-between cursor-pointer"
                                    onSelect={(e) => e.preventDefault()} 
                                >
                                    Delete
                                    <Trash className="mr-2 h-4 w-4"/>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    product and remove your product from our servers.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]