import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const SignupCompany = () => {
    return (
        <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your company</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your email below to create your account
                </p>
            </div>

            {/* Company name */}
            <Field>
                <FieldLabel htmlFor="password"> Company name </FieldLabel>
                <Input id="password" type="text" placeholder="Company name" required />
            </Field>
            
            {/* Email */}
            <Field>
                <FieldLabel htmlFor="email">Company Email</FieldLabel>
                <Input id="email" type="email" placeholder="m@example.com" required />
            </Field>

            {/* Password */}
            <Field>
                <Field className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input id="password" type="password" placeholder="••••••••" required />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                        <Input id="confirm-password" type="password" placeholder="••••••••" required />
                    </Field>
                </Field>
                
                <FieldDescription className="text-xs text-gray-400">
                    Must be at least 8 characters long.
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
