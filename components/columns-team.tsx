"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ChevronsUpDown, ChevronUp, ChevronDown, MoreHorizontal, Eye, Pencil, Trash, User } from "lucide-react"
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

export type TeamMember = {
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
    status: "Active" | "Inactive" | "Pending"
    joinedDate: string
    image?: string
}

export const columns: ColumnDef<TeamMember>[] = [
    {
        accessorKey: "firstName",
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
            const firstName = row.getValue("firstName") as string
            const lastName = row.original.lastName
            const email = row.original.email
            const image = row.original.image
            
            return (
                <div className="ml-3 flex items-center gap-3">
                    <Avatar className="h-9 w-9 rounded-lg">
                        <AvatarImage src={image} alt={firstName} />
                        <AvatarFallback className="rounded-lg">
                            <User className="size-4.5 text-gray-400"/>
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <div>{firstName} {lastName}</div>
                        <div className="text-xs text-gray-400 font-medium">{email}</div>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            return <div className="hidden"></div> // Hidden because we show it under name, but keep for filtering
        },
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-3 h-8">
                    Role
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
            const role = row.getValue("role") as string
            return (
                <div className="font-medium text-gray-600">{role}</div>
            )
        },
    },
    {
        accessorKey: "joinedDate",
        header: "Joined Date",
        cell: ({ row }) => {
            return <div className="text-gray-500">{row.getValue("joinedDate")}</div>
        }
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
            const status = row.getValue("status") as TeamMember["status"]
            
            const variantMap = {
                "Active": "bg-green-100 text-green-500",    
                "Inactive": "bg-red-100 text-red-500",
                "Pending": "bg-orange-100 text-orange-400",
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
                            View Profile
                            <Eye className="mr-2"/>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="justify-between cursor-pointer">
                            Edit Role
                            <Pencil className="mr-2"/>
                        </DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                    className="justify-between cursor-pointer"
                                    onSelect={(e) => e.preventDefault()} 
                                >
                                    Remove
                                    <Trash className="mr-2"/>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Remove team member?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will remove the user from your company. They will lose access to the dashboard immediately.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-500 hover:bg-red-600">Remove</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]