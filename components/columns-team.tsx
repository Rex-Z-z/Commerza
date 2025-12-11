"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ChevronsUpDown, MoreHorizontal, Eye, Trash, Ban, CheckCircle } from "lucide-react"
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
        firstName?: string
        lastName?: string
        profileImage?: string
        phoneNumber?: string
        address?: string
        city?: string
        country?: string
        postalCode?: string
    }
    roles?: { roleName: string }[] 
    status: string
    createdAt?: string
}

const handleStatusChange = async (uuid: string, newStatus: string) => {
    const res = await updateUserStatusAction(uuid, newStatus);
    if (res.success) toast.success(res.message);
    else toast.error(res.error);
}

const handleDelete = async (uuid: string, role: string) => {
    const res = await deleteUserAction(uuid, role);
    if (res.success) toast.success(res.message);
    else toast.error(res.error);
}

export const getColumns = (
    currentUserRole: string, 
    onViewProfile: (user: TeamMember) => void
): ColumnDef<TeamMember>[] => [
    {
        accessorKey: "userProfile.firstName",
        id: "user",
        header: "UserName",
        cell: ({ row }) => {
            const profile = row.original.userProfile
            const fallbackName = row.original.email.split('@')[0]
            const name = (profile?.firstName && profile?.lastName) 
                ? `${profile.firstName} ${profile.lastName}` 
                : (profile?.firstName || fallbackName)
            
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 rounded-lg border border-gray-100">
                        <AvatarImage src={profile?.profileImage} alt={name} />
                        <AvatarFallback className="rounded-lg bg-gray-100 text-gray-500 font-medium">
                            {name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium text-sm text-gray-900">{name}</span>
                        <span className="text-xs text-gray-400 md:hidden">{row.original.email}</span>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc") }>
                Email <ChevronsUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="lowercase text-gray-600">{row.getValue("email") || "Null"}</div>,
    },
        {
        accessorKey: "phoneNumber",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Phone Number <ChevronsUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="lowercase text-gray-600">{row.getValue("phoneNumber") || "Null"}</div>,
    },
    {
        accessorKey: "roles",
        header: "Role",
        cell: ({ row }) => {
            const roles = row.original.roles || []
            
            // --- NEW FILTER LOGIC ---
            // 1. If user has multiple roles, filter out 'buyer'
            let displayRoles = roles;
            if (roles.length > 1) {
                displayRoles = roles.filter(r => r.roleName !== 'buyer');
            }
            // 2. If filtering removed everything (shouldn't happen if length > 1, but safe check), revert
            if (displayRoles.length === 0 && roles.length > 0) {
                displayRoles = roles;
            }

            if (displayRoles.length === 0) return <span className="text-xs text-gray-400 italic">No Role</span>
            
            return (
                <div className="flex flex-wrap gap-1">
                    {displayRoles.map((r, i) => (
                        <Badge key={i} variant="outline" className="capitalize text-xs font-normal">
                            {r.roleName.replace(/_/g, " ")}
                        </Badge>
                    ))}
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = (row.getValue("status") as string) || "pending"
            const variantMap: Record<string, string> = {
                "active": "bg-green-50 text-green-700 ring-green-600/20",    
                "banned": "bg-red-50 text-red-700 ring-red-600/20",
                "suspended": "bg-orange-50 text-orange-700 ring-orange-600/20",
                "pending": "bg-gray-50 text-gray-700 ring-gray-600/20",
            }
            return (
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${variantMap[status.toLowerCase()] || variantMap["pending"]}`}>
                    {status}
                </span>
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
                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onViewProfile(user)}>
                            <Eye className="mr-2 h-4 w-4" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                            Copy Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        {currentUserRole === 'super_admin' && (
                            <>
                                {user.status !== 'active' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.userUuid, 'active')}>
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Activate
                                    </DropdownMenuItem>
                                )}
                                {user.status !== 'banned' && (
                                    <DropdownMenuItem onClick={() => handleStatusChange(user.userUuid, 'banned')} className="text-red-600 focus:text-red-600">
                                        <Ban className="mr-2 h-4 w-4" /> Ban User
                                    </DropdownMenuItem>
                                )}
                            </>
                        )}

                        {currentUserRole === 'admin_company' && (
                            <DropdownMenuItem onClick={() => handleDelete(user.userUuid, 'admin_company')} className="text-red-600 focus:text-red-600">
                                <Trash className="mr-2 h-4 w-4" /> Remove
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]