import React from 'react'
import { getCurrentUser } from '@/app/actions/user'
import { getAllUsersAction } from '@/app/actions/team'
import TeamClient from '@/components/team-client'
import { redirect } from 'next/navigation'

export default async function AdminCompanyPage() {
    const user = await getCurrentUser();
    
    if (!user) {
        return <div>Please log in to view this page.</div>
    }

    const isSuperAdmin = user.roles.some((r: any) => r.roleName === 'super_admin');

    // Security: Only Super Admin should access this page
    if (!isSuperAdmin) {
        return <div className="p-8">You do not have permission to view this page.</div>
    }

    let data = [];
    let error = null;

    // Fetch all users
    const res = await getAllUsersAction();
    if (res.error) {
        error = res.error;
    } else {
        // FILTER: Show ONLY 'admin_company'
        const allUsers = res.data || [];
        data = allUsers.filter((u: any) => 
            u.roles.some((r: any) => r.roleName === 'admin_company')
        );
    }

    return (
        <TeamClient 
            data={data} 
            currentUserRole="super_admin" 
            error={error} 
        />
    )
}