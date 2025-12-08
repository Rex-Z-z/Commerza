import React from 'react'
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
import { SquarePen, UserRound, Image } from 'lucide-react';
import { getCurrentUser } from '@/app/actions/user';

const page = async () => {
    // 1. Fetch the real user data
    const user = await getCurrentUser();
    const profile = user?.userProfile;

    // 2. Derive display values
    const firstName = profile?.firstName || "";
    const lastName = profile?.lastName || "";
    const fullName = (firstName || lastName) ? `${firstName} ${lastName}` : "User";
    const address = profile?.address || "";
    
    const roleName = user?.roles && user.roles.length > 0 
        ? user.roles[0].roleName || user.roles[0].name || "User" 
        : "User";

    return (
        <div>
            {/* Background */}
            <Avatar className='bg-[#D1D9E2] w-full h-60 rounded-lg shadow-xs'>
                {/* 3. Use profile image from backend */}
                <AvatarImage src={profile?.userProfile || ""} className="object-cover" />
                <AvatarFallback className='bg-[#D1D9E2] rounded-lg'>
                    <Image className='relative bottom-4 size-10 text-gray-400'/>
                </AvatarFallback>
            </Avatar>

            {/* Content */}
            <div className='px-5'>
                {/* Profile Header */}
                <div className='relative bottom-16 flex flex-row justify-between bg-white border border-[#ededed] w-full h-34 px-10 pt-5 rounded-lg shadow-xs'>
                    <div className='flex flex-row gap-5'>
                        <Avatar className='relative bottom-16 h-40 w-40 rounded-md border-4 border-white'>
                            <AvatarImage src={profile?.userProfile || ""} className="object-cover" />
                            <AvatarFallback className='rounded-md bg-gray-100'>
                                <UserRound className='size-24 text-gray-300'/>
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col gap-3'>
                            <p className='text-xl font-semibold'>{fullName}</p>
                            <div className='flex flex-col'>
                                <p className='text-sm text-gray-400 capitalize'>{roleName}</p>
                                {/* Display Address or default text */}
                                <p className='text-sm text-gray-400'>{address || "No address set"}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button variant='default' className='w-full px-6'>Change Profile</Button>
                    </div>
                </div>
                
                {/* Details Info - Block 1 */}
                <div className='relative bottom-11 bg-white border border-[#ededed] w-full p-6 rounded-lg shadow-xs'>
                    <FieldSet>
                        <FieldLegend>Personal Information</FieldLegend>
                        <FieldGroup className='gap-4'>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                                    <Input id="firstName" type="text" defaultValue={firstName} className='h-10' disabled/>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                                    <Input id="lastName" type="text" defaultValue={lastName} className='h-10' disabled/>
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input id="email" type="text" defaultValue={user?.email || ""} className='h-10' disabled/>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="phone">Phone</FieldLabel>
                                    <Input id="phone" type="text" defaultValue={user?.phoneNumber || ""} className='h-10' disabled/>
                                </Field>
                            </div>
                          
                            <Button variant='default' className='w-24'>
                                <SquarePen />
                                Edit
                            </Button>
                        </FieldGroup>
                    </FieldSet>
                </div>

                {/* Details Info - Block 2 (Address Details) */}
                {/* Kept as per your original code structure, but note backend lacks specific City/Zip fields currently */}
                <div className='relative bottom-6 bg-white border border-[#ededed] w-full p-6 rounded-lg shadow-xs'>
                    <FieldSet>
                        <FieldLegend>Address Information</FieldLegend>
                        <FieldGroup className='gap-4'>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="county">County</FieldLabel>
                                    <Input id="county" type="text" placeholder="N/A" className='h-10' disabled/>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="city">City</FieldLabel>
                                    <Input id="city" type="text" placeholder="N/A" className='h-10' disabled/>
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
                                    <Input id="postalCode" type="text" placeholder="N/A" className='h-10' disabled/>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="fullAddress">Address</FieldLabel>
                                    <Input id="fullAddress" type="text" defaultValue={address} className='h-10' disabled/>
                                </Field>
                            </div>
                            <Button variant='default' className='w-24'>
                                <SquarePen />
                                Edit
                            </Button>
                        </FieldGroup>
                    </FieldSet>
                </div>
            </div>
        </div>
    )
}

export default page