'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Card, CardContent } from "@/components/ui/card"
import { LoaderCircleIcon } from 'lucide-react';

const Success = () => {
    return (
        <div className='flex flex-col gap-6'>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <FieldGroup className="p-6 md:p-8 md:py-32">
                        <Field className="items-center text-center">
                            <h1 className="text-2xl font-bold">Verification successful</h1>
                            <p className="text-muted-foreground text-sm text-balance">
                              You have successfully verified your email.
                            </p>
                        </Field>
                    </FieldGroup>
                </CardContent>
            </Card>
        </div>
    )
}

const Verification = () => {
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
        setIsDisabled((prev) => !prev);
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    
    return (
        <div className='flex flex-col gap-6'>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <FieldGroup className="p-6 md:p-8 md:py-32">
                        <Field className="items-center text-center">
                            <h1 className="text-2xl font-bold">Enter verification code</h1>
                            <p className="text-muted-foreground text-sm text-balance">
                              We sent a 6-digit code to your email
                            </p>
                        </Field>
                    
                        <Field>
                            <FieldLabel htmlFor="otp" className="sr-only">
                                Verification code
                            </FieldLabel>
                            <InputOTP maxLength={6} id="otp" required containerClassName="justify-center mb-4">
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} className='p-8 text-xl font-semibold'/>
                                    <InputOTPSlot index={1} className='p-8 text-xl font-semibold'/>
                                    <InputOTPSlot index={2} className='p-8 text-xl font-semibold'/>
                                    <InputOTPSlot index={3} className='p-8 text-xl font-semibold'/>
                                    <InputOTPSlot index={4} className='p-8 text-xl font-semibold'/>
                                    <InputOTPSlot index={5} className='p-8 text-xl font-semibold'/>
                                </InputOTPGroup>
                            </InputOTP>
                            <FieldDescription className="text-center">
                                Enter the 6-digit code sent to your email.
                            </FieldDescription>
                         </Field>
                    
                        {/* Button */}
                        <Field>
                            <div className="flex flex-row justify-between gap-2">
                                <Button variant="outline" size="lg" type="submit" className='w-[49%]' asChild>
                                    <a href="/signup">Back</a>
                                </Button>
                                <Button type="submit" size="lg" className='w-[49%]' disabled={isDisabled}>
                                    {isDisabled ? <LoaderCircleIcon className="animate-spin size-4" /> : null}
                                    {isDisabled ? 'Verifying...' : 'Verify'}
                                </Button>
                            </div>
                            <FieldDescription className="text-center">
                                Didn&apos;t receive the code? <a href="#">Resend</a>
                            </FieldDescription>
                        </Field>
                    
                    </FieldGroup>

                    <div className="bg-muted relative hidden md:block">
                        <img
                        src="https://ui.shadcn.com/placeholder.svg"
                        alt="Image"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Verification
