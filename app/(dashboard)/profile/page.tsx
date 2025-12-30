// app/(dashboard)/profile/page.tsx
import React from 'react'
import { getCurrentUser } from '@/app/actions/user'
import ProfileForm from './profile-form'

const page = async () => {
    // 1. Fetch the real user data
    const user = await getCurrentUser();

    // 2. Pass data to Client Component
    return (
        <ProfileForm user={user} />
    )
}

export default page