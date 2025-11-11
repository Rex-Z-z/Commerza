import { Button } from '@/components/ui/button'
import React from 'react'

const page = () => {
    return (
        <div className="flex items-center justify-center h-screen gap-5">
            <Button variant="default" size="lg">
                Default
            </Button>
            <Button variant="outline" size="lg">
                Outline
            </Button>
            <Button variant="secondary" size="lg">
                Secondary
            </Button>
            <Button variant="ghost" size="lg">
                Ghost
            </Button>
            <Button variant="link" size="lg">
                Link
            </Button>
        </div>
    )
}

export default page
