"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Calendar, Shield, User } from "lucide-react"
import { TeamMember } from "@/components/columns-team"

interface ViewProfileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: TeamMember | null
}

export function ViewProfileSheet({ open, onOpenChange, user }: ViewProfileSheetProps) {
  if (!user) return null

  const profile = user.userProfile
  const name = profile ? `${profile.firstName} ${profile.lastName}` : "Unknown User"
  const roles = user.roles?.map(r => r.roleName).join(", ") || "No Role"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>User Profile</SheetTitle>
          <SheetDescription>Detailed information about this user.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col items-center mb-6">
          <Avatar className="h-24 w-24 mb-4 border-4 border-gray-50">
            <AvatarImage src={profile?.profileImage} alt={name} className="object-cover"/>
            <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold text-gray-900">{name}</h2>
          <Badge variant="secondary" className="mt-2 capitalize">
            {roles.replace(/_/g, " ")}
          </Badge>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <span className="text-gray-500 text-xs">Email Address</span>
                    <span className="truncate font-medium">{user.email}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-500 text-xs">Phone Number</span>
                    <span className="font-medium">{profile?.phoneNumber || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Address</h3>
            <div className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex flex-col">
                    <span className="text-gray-500 text-xs">Location</span>
                    <span className="font-medium">
                        {[profile?.address, profile?.city, profile?.country].filter(Boolean).join(", ") || "No address provided"}
                    </span>
                    {profile?.postalCode && <span className="text-gray-400 text-xs mt-1">Zip: {profile.postalCode}</span>}
                </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wider">Account Details</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-xs text-gray-500">Status</span>
                    </div>
                    <span className="text-sm font-semibold capitalize">{user.status || "Active"}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-xs text-gray-500">Joined</span>
                    </div>
                    <span className="text-sm font-semibold">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                    </span>
                </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}