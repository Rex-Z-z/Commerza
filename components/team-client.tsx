"use client"

import React, { useState } from 'react'
import { DataTable } from '@/components/data-table'
import { getColumns, TeamMember } from '@/components/columns-team'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ViewProfileSheet } from './team/view-profile-sheet'
import { EditSellerSheet } from './team/edit-seller-sheet'

interface TeamClientProps {
    data: TeamMember[]
    currentUserRole: string
    error?: string | null
}

export default function TeamClient({ data, currentUserRole, error }: TeamClientProps) {
    const [selectedUser, setSelectedUser] = useState<TeamMember | null>(null)
    const [isViewSheetOpen, setIsViewSheetOpen] = useState(false)
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

    // Handler for viewing
    const handleViewProfile = (user: TeamMember) => {
        setSelectedUser(user)
        setIsViewSheetOpen(true)
    }

    // Handler for editing
    const handleEditProfile = (user: TeamMember) => {
        setSelectedUser(user)
        setIsEditSheetOpen(true)
    }

    const isSuperAdmin = currentUserRole === 'super_admin'
    const title = isSuperAdmin ? "User Management" : "Seller Management"
    const description = isSuperAdmin 
        ? "Overview of all users, admins, and sellers registered on the platform." 
        : "Manage your company's sales team and their permissions."

    // Pass handlers to getColumns
    const columns = getColumns(currentUserRole, handleViewProfile, handleEditProfile)

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
                        <p className="text-sm text-gray-500">{description}</p>
                    </div>
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <Terminal className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">Connection Error</AlertTitle>
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
            )}

            {/* Table Section */}
            <div >
                <DataTable 
                    columns={columns} 
                    data={data} 
                    searchKey="email"
                    actionButton={
                        !isSuperAdmin ? (
                            <Link href="/team/create">
                                <Button className="gap-2 shadow-none bg-[#139ED3] hover:bg-[#0f87b3]">
                                    <Plus className='size-4'/>
                                    Add New Seller
                                </Button>
                            </Link>
                        ) : undefined
                    }
                />
            </div>

            {/* Profile View Sheet */}
            <ViewProfileSheet 
                open={isViewSheetOpen} 
                onOpenChange={setIsViewSheetOpen} 
                user={selectedUser} 
            />

            {/* Seller Edit Sheet */}
            <EditSellerSheet
                open={isEditSheetOpen}
                onOpenChange={setIsEditSheetOpen}
                user={selectedUser}
            />
        </div>
    )
}