'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
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
import { LoaderCircleIcon, Check } from 'lucide-react';

const Success = () => {
    return (
        <div className='flex flex-col gap-6'>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <FieldGroup className="p-6 md:p-8 md:py-32">
                        <Field className="flex flex-col gap-6 justify-center">
                            <div className="flex items-center justify-center">
                                <Check strokeWidth={3} className='size-16 p-2.5 text-white bg-green-500 rounded-full'/>
                            </div>
                            <div className="items-center text-center">
                                <h1 className="text-2xl font-bold">Verification successful</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                  You have successfully verified your email.
                                </p>
                            </div>
                            {/* Added login button */}
                            <Button asChild className="mt-4">
                                <a href="/login">Go to Login</a>
                            </Button>
                        </Field>
                    </FieldGroup>

                    {/* Added image for layout consistency */}
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

const Verification = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [otpValue, setOtpValue] = useState("");
    const [error, setError] = useState("");
    
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    useEffect(() => {
        const interval = setInterval(() => {
        setIsDisabled((prev) => !prev);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (otpValue.length !== 6) {
            setError("Please enter a complete 6-digit code.");
            return;
        }

        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
            
            const response = await fetch(`${apiUrl}/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email, 
                    otpCode: otpValue 
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Verification failed");
            }

            // On success, set verified to true
            setIsVerified(true);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "An error occurred during verification.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async (e: React.MouseEvent) => {
        e.preventDefault();
        if(!email) return;

        setError("");
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
            const response = await fetch(`${apiUrl}/auth/resend-otp`, { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email }) 
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to resend code");
            }
            
            // Optional: Add a visual indicator that code was resent (e.g. alert or toast)
            alert(`Code sent to ${email}`);
            
        } catch (err: any) {
            setError(err.message);
        }
    };

    // --- Conditional Rendering ---
    if (isVerified) {
        return <Success />;
    }
    
    return (
        <div className='flex flex-col gap-6'>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form onSubmit={handleVerifySubmit}>
                        <FieldGroup className="p-6 md:p-8 md:py-32">
                            <Field className="items-center text-center">
                                <h1 className="text-2xl font-bold">Enter verification code</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                  We sent a 6-digit code to {email || 'your email'}
                                </p>
                            </Field>

                            {/* Verification code */}
                            <Field>
                                <FieldLabel htmlFor="otp" className="sr-only">
                                    Verification code
                                </FieldLabel>
                                <InputOTP 
                                    maxLength={6} 
                                    id="otp" 
                                    required 
                                    containerClassName="justify-center mb-4"
                                    value={otpValue}
                                    onChange={(value) => setOtpValue(value)}
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} className='p-8 text-xl font-semibold'/>
                                        <InputOTPSlot index={1} className='p-8 text-xl font-semibold'/>
                                        <InputOTPSlot index={2} className='p-8 text-xl font-semibold'/>
                                        <InputOTPSlot index={3} className='p-8 text-xl font-semibold'/>
                                        <InputOTPSlot index={4} className='p-8 text-xl font-semibold'/>
                                        <InputOTPSlot index={5} className='p-8 text-xl font-semibold'/>
                                    </InputOTPGroup>
                                </InputOTP>
                                {error ? (
                                    <FieldDescription className="text-center text-red-500">
                                        {error}
                                    </FieldDescription>
                                ) : (
                                    <FieldDescription className="text-center">
                                        Enter the 6-digit code sent to your email.
                                    </FieldDescription>
                                )}
                             </Field>
                        
                            {/* Button */}
                            <Field>
                                <div className="flex flex-row justify-between gap-2">
                                    <Button variant="outline" size="lg" type="button" className='w-[49%]' asChild>
                                        <a href="/signup">Back</a>
                                    </Button>
                                    <Button type="submit" size="lg" className='w-[49%]' disabled={isLoading}>
                                        {isLoading ? <LoaderCircleIcon className="animate-spin size-4" /> : null}
                                        {isLoading ? 'Verifying...' : 'Verify'}
                                    </Button>
                                </div>
                                <FieldDescription className="text-center">
                                    Didn&apos;t receive the code? <a href="#" onClick={handleResend} className="hover:underline text-primary">Resend</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>

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