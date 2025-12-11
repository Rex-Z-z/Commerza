import React from 'react'
import { getCurrentUser } from '@/app/actions/user'
import { getAllUsersAction, getCompanySellersAction } from '@/app/actions/team'
import TeamClient from '@/components/team-client'

export default async function TeamPage() {
    const user = await getCurrentUser();
    
    // Safety check if user is not logged in
    if (!user) {
        return <div>Please log in to view this page.</div>
    }

    // Determine role (using lowercase to match your Java backend)
    const isSuperAdmin = user.roles.some((r: any) => r.roleName === 'super_admin');
    const isCompanyAdmin = user.roles.some((r: any) => r.roleName === 'admin_company');

    let data = [];
    let error = null;

    // Fetch data based on role
    if (isSuperAdmin) {
        const res = await getAllUsersAction();
        if (res.error) error = res.error;
        else data = res.data || [];
    } else if (isCompanyAdmin) {
        const res = await getCompanySellersAction();
        if (res.error) error = res.error;
        else data = res.data || [];
    } else {
        return <div className="p-8">You do not have permission to view this page.</div>
    }

    // Pass data to the client component
    return (
        <TeamClient 
            data={data} 
            currentUserRole={isSuperAdmin ? 'super_admin' : 'admin_company'} 
            error={error} 
        />
    )
}