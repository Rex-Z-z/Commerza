"use client"

import React from 'react'
import { DataTable } from '@/components/data-table'
import { getColumns, TeamMember } from '@/components/columns-team'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TeamClientProps {
    data: TeamMember[]
    currentUserRole: string
    error?: string | null
}

export default function TeamClient({ data, currentUserRole, error }: TeamClientProps) {
    const title = currentUserRole === 'super_admin' ? "Platform Users" : "My Sellers"
    const description = currentUserRole === 'super_admin' 
        ? "Manage all users, admins, and sellers across the platform." 
        : "Manage sales staff within your company."

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

            {/* FIXED: Pass searchKey and actionButton */}
            <DataTable 
                columns={columns} 
                data={data} 
                searchKey="email"
                actionButton={
                    currentUserRole === 'admin_company' ? (
                        <Link href="/dashboard/team/create">
                            <Button>
                                Add Seller
                                <Plus className='size-4'/>
                            </Button>
                        </Link>
                    ) : undefined
                }
            />
        </div>
    )
}