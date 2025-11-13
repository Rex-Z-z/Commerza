'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Eye, EyeClosed } from 'lucide-react';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input, InputWrapper } from "@/components/ui/input"

const SignupCompany = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prev) => !prev);
    }
    
    return (
        <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your company</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your email below to create your company
                </p>
            </div>

            {/* Company name */}
            <Field>
                <FieldLabel htmlFor="password"> Company name </FieldLabel>
                <Input id="password" type="text" placeholder="Company name" required />
            </Field>
            
            {/* Email */}
            <Field>
                <FieldLabel htmlFor="email">Company email</FieldLabel>
                <Input id="email" type="email" placeholder="company@example.com" required />
            </Field>

            {/* Password */}
            <Field>
                <Field className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <InputWrapper>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
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
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
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
                <FieldDescription className="text-xs text-gray-400">
                    "Must be at least 8 characters long, start with an uppercase letter, and include a number."
                </FieldDescription>
            </Field>
            
            {/* Submit */}
            <Field>
                <Button type="submit">Create Account</Button>
            </Field>
            
            <FieldDescription className="text-center">
                Already have an account? <a href="/login">Sign in</a>
            </FieldDescription>
        </FieldGroup>
    )
}

export default SignupCompany
