'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Eye, EyeClosed, LoaderCircleIcon } from 'lucide-react';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Input, InputWrapper } from "@/components/ui/input"
import { useRouter } from 'next/navigation';

type ErrorState = {
  email?: string;
  password?: string;
  general?: string;
}

const SignupCompany = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<ErrorState>({});
    const [email, setEmail] = useState('');
    const router = useRouter();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const companyName = formData.get('company-name');
        const password = String(formData.get('password') || ''); // Get as string
        const confirmPassword = String(formData.get('confirm-password') || ''); // Get as string

        if (password !== confirmPassword) {
            setErrors({ password: "Passwords do not match." });
            return; 
        }

        const passwordErrors: string[] = [];
        if (password.length < 8) {
            passwordErrors.push("Must be at least 8 characters long.");
        }
        if (!/^[A-Z]/.test(password)) {
            passwordErrors.push("Must start with an uppercase letter.");
        }
        if (!/\d/.test(password)) {
            passwordErrors.push("Must include a number.");
        }

        if (passwordErrors.length > 0) {
            // Join errors with a space. e.g. "Must be at least 8... Must include a number."
            setErrors({ password: passwordErrors.join(" ") });
            return;
        }

        setIsLoading(true);

        // Handle API call and errors
        try {
            // --- Simulate a failed API response for demonstration ---
            await new Promise(resolve => setTimeout(resolve, 1500));
            const response = { 
                ok: false, // Changed to false to test error case
                json: async () => ({ 
                    field: "email", 
                    message: "This company email is already registered." 
                })
            };
            // --- End of simulation block ---


            if (!response.ok) {
                const errorData = await response.json();
                
                if (errorData.field === 'email') {
                    setErrors({ email: errorData.message });
                } else if (errorData.field === 'password') {
                    setErrors({ password: errorData.message });
                } else {
                    setErrors({ general: errorData.message || "An unknown error occurred." });
                }
                
                throw new Error(errorData.message || 'Failed to create account');
            }
            
            router.push(`/verify?email=${encodeURIComponent(email)}`);

        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Create your company</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to create your company
                    </p>
                </div>

                {/* Company name */}
                <Field>
                    <FieldLabel htmlFor="company-name"> Company name </FieldLabel>
                    <Input 
                        id="company-name"
                        name="company-name"
                        type="text" 
                        placeholder="Company name" 
                        required 
                    />
                </Field>
                
                {/* Email */}
                <Field>
                    <FieldLabel htmlFor="email">Company email</FieldLabel>
                    <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        placeholder="company@example.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        aria-invalid={!!errors.email}
                    />
                    {errors.email ? (
                        <FieldError className='text-xs'>{errors.email}</FieldError>
                    ) : (
                        <FieldDescription className="text-xs text-gray-400">
                            Enter your company email
                        </FieldDescription>
                    )}
                </Field>

                {/* Password */}
                <Field>
                    <Field className="grid grid-cols-2 gap-4">
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <InputWrapper>
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    aria-invalid={!!errors.password}
                                />
                                <Button 
                                    type="button"
                                    variant="ghost" 
                                    size='icon' 
                                    className='hover:bg-transparent -me-3.5 text-muted-foreground hover:text-foreground'
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
                                </Button>
                            </InputWrapper>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                            <InputWrapper>
                                <Input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    aria-invalid={!!errors.password}
                                />
                                <Button 
                                    type="button"
                                    variant="ghost" 
                                    size='icon' 
                                    className='hover:bg-transparent -me-3.5 text-muted-foreground hover:text-foreground'
                                    onClick={toggleConfirmPasswordVisibility}
                                >
                                    {showConfirmPassword ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
                                </Button>
                            </InputWrapper>
                        </Field>
                    </Field>
                    {errors.password ? (
                        <FieldError className='text-xs'>{errors.password}</FieldError>
                    ) : (
                        <FieldDescription className="text-xs text-gray-400">
                           Must be at least 8 characters long, start with an uppercase letter, and include a number.
                        </FieldDescription>
                    )}
                </Field>
                
                {/* Submit */}
                <Field>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? <LoaderCircleIcon className="animate-spin size-4" /> : null}
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                    {errors.general && (
                        <FieldError className="text-center">{errors.general}</FieldError>
                    )}
                </Field>
                
                <FieldDescription className="text-center">
                    Already have an account? <a href="/login">Sign in</a>
                </FieldDescription>
            </FieldGroup>
        </form>
    )
}

export default SignupCompany