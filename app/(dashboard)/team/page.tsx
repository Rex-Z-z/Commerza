import React from 'react'
import { columns, TeamMember } from "./components/columns-team"
import { DataTable } from './components/data-table';

// Mock data fetcher - Replace with your actual API call
async function getData(): Promise<TeamMember[]> {
    return [
        {
            id: "1",
            firstName: "Chou",
            lastName: "Seangly",
            email: "seangly@example.com",
            role: "SUPER_ADMIN",
            status: "Active",
            joinedDate: "Jan 12, 2024"
        },
        {
            id: "2",
            firstName: "Sarah",
            lastName: "Connor",
            email: "sarah.c@company.com",
            role: "COMPANY_ADMIN",
            status: "Active",
            joinedDate: "Feb 01, 2024"
        },
        {
            id: "3",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@seller.com",
            role: "SELLER",
            status: "Pending",
            joinedDate: "Mar 15, 2024"
        },
        {
            id: "4",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.s@seller.com",
            role: "SELLER",
            status: "Inactive",
            joinedDate: "Mar 20, 2024"
        }
    ];
}

const TeamPage = async () => {
    const data = await getData()

    return (
        <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
                    <p className="text-gray-500">Manage your company members and their permissions.</p>
                </div>
            </div>
            <DataTable columns={columns} data={data} />
        </div>
    )
}

export default TeamPage