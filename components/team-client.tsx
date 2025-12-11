"use client"

import React from 'react'
import { DataTable } from '@/components/data-table'
import { getColumns, TeamMember } from '@/components/columns-team'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

interface TeamClientProps {
    data: TeamMember[]
    currentUserRole: string
    error?: string | null
}

export default function TeamClient({ data, currentUserRole, error }: TeamClientProps) {
    // Determine title based on role
    const title = currentUserRole === 'super_admin' ? "Platform Users" : "My Sellers"
    const description = currentUserRole === 'super_admin' 
        ? "Manage all users, admins, and sellers across the platform." 
        : "Manage sales staff within your company."

    // Now it's safe to call getColumns here because we are in a Client Component
    const columns = getColumns(currentUserRole)

    return (
        <div className="flex flex-col gap-5 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {title}
                    </h1>
                    <p className="text-gray-500">
                        {description}
                    </p>
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error fetching data</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <DataTable columns={columns} data={data} />
        </div>
    )
}