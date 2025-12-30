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

    const userRoles = user.roles || [];
    // Helper to check roles safely and case-insensitively
    const hasRole = (targetRole: string) => {
        return userRoles.some((r: any) => {
            const name = (r.roleName || r.name || '').toLowerCase();
            return name === targetRole.toLowerCase();
        });
    }

    const isSuperAdmin = hasRole('super_admin');
    const isCompanyAdmin = hasRole('admin_company');

    let data = [];
    let error = null;

    // Fetch data based on role
    if (isSuperAdmin) {
        const res = await getAllUsersAction();
        if (res.error) {
            error = res.error;
        } else {
            // FILTER: Show ONLY 'buyer' and 'seller_company'
            const allUsers = res.data || [];
            
            data = allUsers.filter((u: any) => {
                const uRoles = u.roles || [];
                // Check if the user has ANY of the target roles
                return uRoles.some((r: any) => {
                    const rName = (r.roleName || r.name || '').toLowerCase();
                    return rName === 'buyer' || rName === 'seller_company' || rName === 'seller_individual';
                });
            });
        }
    } else if (isCompanyAdmin) {
        // Keep existing logic for Company Admin (seeing their own sellers)
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