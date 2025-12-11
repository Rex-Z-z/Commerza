"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ChevronsUpDown, MoreHorizontal, Eye, Pencil, Trash, Ban, CheckCircle } from "lucide-react"
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
import { deleteUserAction, updateUserStatusAction } from "@/app/actions/team"
import { toast } from "sonner"

export type TeamMember = {
    userUuid: string
    email: string
    userProfile?: {
        firstName: string
        lastName: string
        profileImage: string
    }
    roles: { roleName: string }[]
    status: string
    createdAt: string
}

// Function to handle status updates
const handleStatusChange = async (uuid: string, newStatus: string) => {
    const res = await updateUserStatusAction(uuid, newStatus);
    if (res.success) {
        toast.success(res.message);
    } else {
        toast.error(res.error);
    }
}

const handleDelete = async (uuid: string, role: string) => {
    const res = await deleteUserAction(uuid, role);
    if (res.success) {
        toast.success(res.message);
    } else {
        toast.error(res.error);
    }
}

export const getColumns = (currentUserRole: string): ColumnDef<TeamMember>[] => [
    {
        accessorKey: "userProfile.firstName",
        header: "User",
        cell: ({ row }) => {
            const profile = row.original.userProfile
            const name = profile ? `${profile.firstName} ${profile.lastName}` : "Unknown User"
            const email = row.original.email
            const image = profile?.profileImage
            
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 rounded-lg">
                        <AvatarImage src={image} alt={name} />
                        <AvatarFallback className="rounded-lg bg-gray-100">
                            {name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">{name}</span>
                        <span className="text-xs text-gray-500">{email}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "roles",
        header: "Role",
        cell: ({ row }) => {
            const roles = row.original.roles.map(r => r.roleName).join(", ")
            return (
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                        {roles.replace("_", " ")}
                    </Badge>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            
            // Style map matches product status styles
            const variantMap: Record<string, string> = {
                "active": "bg-green-100 text-green-600 hover:bg-green-100",    
                "banned": "bg-red-100 text-red-600 hover:bg-red-100",
                "suspended": "bg-orange-100 text-orange-600 hover:bg-orange-100",
                "pending": "bg-gray-100 text-gray-600 hover:bg-gray-100",
            }

            return (
                <Badge className={`border-0 ${variantMap[status.toLowerCase()] || variantMap["pending"]}`}>
                    {status}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original
            
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
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                            Copy Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        {/* Actions for Super Admin */}
                        {currentUserRole === 'super_admin' && (
                            <>
                                {user.status !== 'active' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.userUuid, 'active')}>
                                        <CheckCircle className="mr-2 h-4 w-4" /> Activate
                                    </DropdownMenuItem>
                                )}
                                {user.status !== 'banned' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.userUuid, 'banned')} className="text-red-600">
                                        <Ban className="mr-2 h-4 w-4" /> Ban User
                                    </DropdownMenuItem>
                                )}
                            </>
                        )}

                        {/* Actions for Company Admin */}
                        {currentUserRole === 'admin_company' && (
                            <DropdownMenuItem onClick={() => handleDelete(user.userUuid, 'admin_company')} className="text-red-600">
                                <Trash className="mr-2 h-4 w-4" /> Remove Seller
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]