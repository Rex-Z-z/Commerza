"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { TeamMember } from "@/components/columns-team"
import EditSellerForm from "@/components/forms/edit-seller-form"

interface EditSellerSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: TeamMember | null
}

export function EditSellerSheet({ open, onOpenChange, user }: EditSellerSheetProps) {
  if (!user) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle>Edit Seller</SheetTitle>
          <SheetDescription>Update the personal details for this seller.</SheetDescription>
        </SheetHeader>
        
        <EditSellerForm 
            user={user} 
            onSuccess={() => onOpenChange(false)} 
        />
      </SheetContent>
    </Sheet>
  )
}