import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SquarePen, UserRound, Image } from 'lucide-react';

const page = () => {
    return (
        <div>
            {/* Background */}
            <Avatar className='bg-[#D1D9E2] w-full h-60 rounded-lg shadow-xs'>
                <AvatarImage src="" />
                <AvatarFallback className='bg-[#D1D9E2] rounded-lg'>
                    <Image className='relative bottom-4 size-10 text-gray-400'/>
                </AvatarFallback>
            </Avatar>

            {/* Content */}
            <div className='px-5'>
                {/* Profile */}
                <div className='relative bottom-16 flex flex-row justify-between bg-white border border-[#ededed] w-full h-34 px-10 pt-5 rounded-lg shadow-xs'>
                    <div className='flex flex-row gap-5'>
                        <Avatar className='relative bottom-16 h-40 w-40 rounded-md'>
                            <AvatarImage src="" />
                            <AvatarFallback className='rounded-md'>
                                <UserRound className='size-24 text-gray-300'/>
                            </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col gap-3'>
                            <p className='text-xl font-semibold'>Chou Seangly</p>
                            <div className='flex flex-col'>
                                <p className='text-sm text-gray-400'>Seller</p>
                                <p className='text-sm text-gray-400'>Phnom Penh</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button variant='default' className='w-full px-6'>Change Profile</Button>
                    </div>
                </div>
                
                {/* Details Info */}
                <div className='relative bottom-11 bg-white border border-[#ededed] w-full p-6 rounded-lg shadow-xs'>
                    <FieldSet>
                        <FieldLegend>General Information</FieldLegend>
                        <FieldGroup className='gap-4'>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="city">First Name</FieldLabel>
                                    <Input id="city" type="text" placeholder="Chou" className='h-10' disabled/>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="zip">Last Name</FieldLabel>
                                    <Input id="zip" type="text" placeholder="Seangly" className='h-10' disabled/>
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="city">County</FieldLabel>
                                    <Input id="city" type="text" placeholder="Toul Songkea" className='h-10' disabled/>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="zip">City</FieldLabel>
                                    <Input id="zip" type="text" placeholder="Phnom Penh" className='h-10' disabled/>
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="city">Postal Code</FieldLabel>
                                    <Input id="city" type="text" placeholder="11000" className='h-10' disabled/>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="zip">Address</FieldLabel>
                                    <Input id="zip" type="text" placeholder="Street 70" className='h-10' disabled/>
                                </Field>
                            </div>
                            <Button variant='default' className='w-24'>
                                <SquarePen />
                                Edit
                            </Button>
                        </FieldGroup>
                    </FieldSet>
                </div>

                <div className='relative bottom-6 bg-white border border-[#ededed] w-full p-6 rounded-lg shadow-xs'>
                    <FieldSet>
                        <FieldLegend>General Information</FieldLegend>
                        <FieldGroup className='gap-4'>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="city">First Name</FieldLabel>
                                    <Input id="city" type="text" placeholder="Chou" className='h-10' disabled/>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="zip">Last Name</FieldLabel>
                                    <Input id="zip" type="text" placeholder="Seangly" className='h-10' disabled/>
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="city">County</FieldLabel>
                                    <Input id="city" type="text" placeholder="Toul Songkea" className='h-10' disabled/>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="zip">City</FieldLabel>
                                    <Input id="zip" type="text" placeholder="Phnom Penh" className='h-10' disabled/>
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="city">Postal Code</FieldLabel>
                                    <Input id="city" type="text" placeholder="11000" className='h-10' disabled/>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="zip">Address</FieldLabel>
                                    <Input id="zip" type="text" placeholder="Street 70" className='h-10' disabled/>
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
