import {VerifyReset} from '@/components/verify-reset'
import React, { Suspense } from 'react'

const Page = () => {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-6xl">
                 <Suspense fallback={<div>Loading...</div>}>
                    <VerifyReset />
                 </Suspense>
            </div>
        </div>
    )
}

export default Page