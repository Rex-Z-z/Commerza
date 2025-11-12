import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface UserProps {
  onPrevStep?: () => void;
}

const Verification = ({ onPrevStep }: UserProps) => {
    const handlePrevStep = () => {
        onPrevStep?.();
    };

    return (
        <FieldGroup>
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
                        <InputOTPSlot index={0} className='p-6 text-lg'/>
                        <InputOTPSlot index={1} className='p-6 text-lg'/>
                        <InputOTPSlot index={2} className='p-6 text-lg'/>
                        <InputOTPSlot index={3} className='p-6 text-lg'/>
                        <InputOTPSlot index={4} className='p-6 text-lg'/>
                        <InputOTPSlot index={5} className='p-6 text-lg'/>
                    </InputOTPGroup>
                </InputOTP>
                <FieldDescription className="text-center">
                    Enter the 6-digit code sent to your email.
                </FieldDescription>
             </Field>
        
            {/* Button */}
            <Field>
                <div className="flex flex-row justify-between gap-2">
                    <Button variant="outline" type="submit" className='w-[49%]' onClick={handlePrevStep}>Back</Button>
                    <Button type="submit" className='w-[49%]'>Verify</Button>
                </div>
                <FieldDescription className="text-center">
                    Didn&apos;t receive the code? <a href="#">Resend</a>
                </FieldDescription>
            </Field>

            
        </FieldGroup>
    )
}

export default Verification
