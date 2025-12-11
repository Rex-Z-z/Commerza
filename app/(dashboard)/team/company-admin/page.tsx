import React from 'react'
import { getCurrentUser } from '@/app/actions/user'
import { getAllUsersAction } from '@/app/actions/team'
import TeamClient from '@/components/team-client'

export default async function AdminCompanyPage() {
    const user = await getCurrentUser();
    
    if (!user) {
        return <div>Please log in to view this page.</div>
    }

    const userRoles = user.roles || [];
    const isSuperAdmin = userRoles.some((r: any) => {
        const name = (r.roleName || r.name || '').toLowerCase();
        return name === 'super_admin';
    });

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
        
        data = allUsers.filter((u: any) => {
            const uRoles = u.roles || [];
            return uRoles.some((r: any) => {
                const rName = (r.roleName || r.name || '').toLowerCase();
                return rName === 'admin_company';
            });
        });
    }

    return (
        <TeamClient 
            data={data} 
            currentUserRole="super_admin" 
            error={error} 
        />
    )
}