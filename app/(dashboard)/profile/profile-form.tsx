// app/(dashboard)/profile/profile-form.tsx
'use client'

import React, { useState, useRef, useTransition } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SquarePen, UserRound, Image as ImageIcon, Save, X, Loader2, Camera } from 'lucide-react'
import { updateUserProfile } from '@/app/actions/user'

interface ProfileFormProps {
  user: any
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  
  // -- State for Edit Modes --
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)

  // -- State for Form Data --
  const profile = user?.userProfile || {}
  
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    email: user?.email || "",
    phoneNumber: profile?.phoneNumber || user?.phoneNumber || "",
    address: profile?.address || "",
    city: profile?.city || "",
    country: profile?.country || "",
    postalCode: profile?.postalCode || "",
  })

  // -- State for Image Uploads --
  const [previewProfile, setPreviewProfile] = useState<string | null>(null)
  const [previewCover, setPreviewCover] = useState<string | null>(null)

  // Refs for hidden file inputs
  const profileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  // -- Handlers --
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  // --- Profile Picture Logic ---
  const handleProfileClick = () => {
    profileInputRef.current?.click()
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreviewProfile(objectUrl)
      // Auto-submit specific file field
      handleUploadFile('profilePictureFile', file)
    }
  }

  // --- Cover Picture Logic ---
  const handleCoverClick = () => {
    coverInputRef.current?.click()
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreviewCover(objectUrl)
      // Auto-submit specific file field
      handleUploadFile('coverProfileFile', file)
    }
  }

  // Generic File Upload Handler
  const handleUploadFile = (fieldName: string, file: File) => {
    startTransition(async () => {
        const data = new FormData()
        data.append(fieldName, file)
        
        const result = await updateUserProfile(data)
        if (!result.success) {
            alert(result.message)
            // Revert previews on failure if needed
            if (fieldName === 'profilePictureFile') setPreviewProfile(null)
            if (fieldName === 'coverProfileFile') setPreviewCover(null)
        }
    })
  }

  // Text Section Submit Handler
  const handleSectionSubmit = (section: 'personal' | 'address') => {
    startTransition(async () => {
      const data = new FormData()
      
      // Append all text fields
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value)
      })

      const result = await updateUserProfile(data)
      
      if (result.success) {
        if (section === 'personal') setIsEditingPersonal(false)
        if (section === 'address') setIsEditingAddress(false)
      } else {
        alert(result.message)
      }
    })
  }

  // Derived Display Values
  const fullName = (formData.firstName || formData.lastName) 
    ? `${formData.firstName} ${formData.lastName}` 
    : "User"
  
  const roleName = user?.roles && user.roles.length > 0 
    ? user.roles[0].roleName || user.roles[0].name || "User" 
    : "User"

  // Determine which images to show (Preview vs Saved)
  const displayProfile = previewProfile || profile?.userProfile || ""
  const displayCover = previewCover || profile?.coverProfile || ""

  return (
    <div>
      {/* Hidden File Inputs */}
      <input 
        type="file" 
        ref={profileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleProfileChange}
      />
      <input 
        type="file" 
        ref={coverInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleCoverChange}
      />

      {/* Background (Cover Profile) */}
      <div 
        className='relative group w-full h-60 rounded-lg cursor-pointer'
        onClick={handleCoverClick}
      >
          {/* Main Cover Image */}
          <Avatar className='bg-[#D1D9E2] w-full h-full rounded-lg shadow-xs'>
            <AvatarImage src={displayCover} className="object-cover" />
            <AvatarFallback className='bg-[#D1D9E2] rounded-lg w-full h-full flex items-center justify-center'>
              <ImageIcon className='size-10 text-gray-400'/>
            </AvatarFallback>
          </Avatar>

          {/* Hover Overlay with Edit Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
             <Button variant="default" className="gap-2" disabled={isPending}>
                {isPending ? <Loader2 className="animate-spin size-4"/> : <Camera className="size-4"/>}
                Edit Cover
             </Button>
          </div>
      </div>

      {/* Content */}
      <div className='px-5'>
        {/* Profile Header */}
        <div className='relative bottom-16 flex flex-row justify-between bg-white border border-[#ededed] w-full h-34 px-10 pt-5 rounded-lg shadow-xs'>
          <div className='flex flex-row gap-5'>
            {/* Profile Picture */}
            <div className="relative group cursor-pointer" onClick={handleProfileClick}>
                <Avatar className='relative bottom-16 h-40 w-40 rounded-md'>
                    <AvatarImage src={displayProfile} className="object-cover" />
                    <AvatarFallback className='rounded-md bg-gray-100 flex items-center justify-center'>
                        <UserRound className='size-24 text-gray-300'/>
                    </AvatarFallback>
                </Avatar>
            
            </div>
            
            <div className='flex flex-col gap-3'>
              <p className='text-xl font-semibold'>{fullName}</p>
              <div className='flex flex-col'>
                <p className='text-sm text-gray-400 capitalize'>{roleName}</p>
                <p className='text-sm text-gray-400'>{formData.address || "No address set"}</p>
              </div>
            </div>
          </div>

          <div>
            <Button 
                variant='default' 
                className='w-full px-6' 
                onClick={handleProfileClick}
                disabled={isPending}
            >
                {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                Change Profile Picture
            </Button>
          </div>
        </div>
        
        {/* Details Info - Block 1 (Personal) */}
        <div className='relative bottom-11 bg-white border border-[#ededed] w-full p-6 rounded-lg shadow-xs'>
          <FieldSet>
            <div className="flex justify-between items-center mb-4">
                <FieldLegend>Personal Information</FieldLegend>
                {/* Toggle Edit/Save Buttons */}
                {!isEditingPersonal ? (
                    <Button variant='default' size="sm" onClick={() => setIsEditingPersonal(true)}>
                        <SquarePen className="h-4 w-4" /> Edit
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant='outline' size="sm" onClick={() => setIsEditingPersonal(false)}>
                            <X className="h-4 w-4" /> Cancel
                        </Button>
                        <Button variant='default' size="sm" onClick={() => handleSectionSubmit('personal')} disabled={isPending}>
                             {isPending ? <Loader2 className="animate-spin  h-4 w-4" /> : <Save className="h-4 w-4" />} Save
                        </Button>
                    </div>
                )}
            </div>

            <FieldGroup className='gap-4'>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input 
                    id="firstName" 
                    type="text" 
                    value={formData.firstName} 
                    onChange={handleChange}
                    className='h-10' 
                    disabled={!isEditingPersonal}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input 
                    id="lastName" 
                    type="text" 
                    value={formData.lastName} 
                    onChange={handleChange}
                    className='h-10' 
                    disabled={!isEditingPersonal}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input 
                    id="email" 
                    type="text" 
                    value={formData.email} 
                    onChange={handleChange}
                    className='h-10' 
                    disabled={!isEditingPersonal}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="phoneNumber">Phone</FieldLabel>
                  <Input 
                    id="phoneNumber" 
                    type="text" 
                    value={formData.phoneNumber} 
                    onChange={handleChange}
                    className='h-10' 
                    disabled={!isEditingPersonal}
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
        </div>

        {/* Details Info - Block 2 (Address) */}
        <div className='relative bottom-6 bg-white border border-[#ededed] w-full p-6 rounded-lg shadow-xs'>
          <FieldSet>
            <div className="flex justify-between items-center mb-4">
                <FieldLegend>Address Information</FieldLegend>
                {!isEditingAddress ? (
                    <Button variant='outline' size="sm" onClick={() => setIsEditingAddress(true)}>
                        <SquarePen className=" h-4 w-4" /> Edit
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button variant='outline' size="sm" onClick={() => setIsEditingAddress(false)}>
                            <X className=" h-4 w-4" /> Cancel
                        </Button>
                        <Button variant='default' size="sm" onClick={() => handleSectionSubmit('address')} disabled={isPending}>
                            {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />} Save
                        </Button>
                    </div>
                )}
            </div>

            <FieldGroup className='gap-4'>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <Input 
                    id="country" 
                    type="text" 
                    value={formData.country} 
                    onChange={handleChange}
                    placeholder="e.g. Cambodia" 
                    className='h-10' 
                    disabled={!isEditingAddress}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="city">City</FieldLabel>
                  <Input 
                    id="city" 
                    type="text" 
                    value={formData.city} 
                    onChange={handleChange}
                    placeholder="e.g. Phnom Penh" 
                    className='h-10' 
                    disabled={!isEditingAddress}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
                  <Input 
                    id="postalCode" 
                    type="text" 
                    value={formData.postalCode} 
                    onChange={handleChange}
                    placeholder="e.g. 12000" 
                    className='h-10' 
                    disabled={!isEditingAddress}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <Input 
                    id="address" 
                    type="text" 
                    value={formData.address} 
                    onChange={handleChange}
                    className='h-10' 
                    disabled={!isEditingAddress}
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
        </div>
      </div>
    </div>
  )
}