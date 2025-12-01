'use client'

import { ColumnDef } from "@tanstack/react-table"
import { ChevronsUpDown , MoreHorizontal, Eye, Pencil, Trash, } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Rating, RatingButton } from "@/components/ui/shadcn-io/rating"
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
    // This is the select column and currently we know what to do with this
    // {
    //     id: "select",
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={
    //                 table.getIsAllPageRowsSelected() ||
    //                 (table.getIsSomePageRowsSelected() && "indeterminate")
    //             }
    //             onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //             aria-label="Select all"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox
    //             checked={row.getIsSelected()}
    //             onCheckedChange={(value) => row.toggleSelected(!!value)}
    //             aria-label="Select row"
    //         />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    // },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="h-8">
                    Name
                    <ChevronsUpDown  />
                </Button>
            )
        },
        cell: ({ row }) => {
            const name = row.getValue("name") as string
            return (
                <div className="ml-3 flex items-center gap-3">
                    <Avatar className="h-9 w-9 rounded-lg">
                        <AvatarImage alt={name} />
                        <AvatarFallback className="rounded-lg">
                            {name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <div>{name}</div>
                        <div className="text-xs text-gray-400 font-medium">{name}</div>
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
        cell: ({ row }) => {
            const price = row.getValue("price") as number
            return (
                <div className="text-gray-500 w-16 truncate" title={price.toString() + "$"}>{price}$</div>
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
        cell: ({ row }) => {
            const rating = Math.round(row.getValue("rating") as number * 2) / 2
            return (
                <div className="flex flex-col">
                    <Rating value={rating} readOnly>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <RatingButton key={index} className="text-yellow-500 size-4.5" />
                        ))}
                    </Rating>
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
                    <DropdownMenuContent className="text-gray-500" align="end">
                        <DropdownMenuLabel className="text-black">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="justify-between cursor-pointer">
                            View
                            <Eye className="mr-2"/>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="justify-between cursor-pointer">
                            Edit
                            <Pencil className="mr-2"/>
                        </DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                    className="justify-between cursor-pointer"
                                    onSelect={(e) => e.preventDefault()} 
                                >
                                    Delete
                                    <Trash className="mr-2"/>
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