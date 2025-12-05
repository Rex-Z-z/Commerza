"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeClosed, LoaderCircleIcon, Check } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter, useSearchParams } from "next/navigation";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const [otpValue, setOtpValue] = useState("");
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || "";

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const newPassword = formData.get("new-password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
    }

    if (otpValue.length !== 6) {
        setError("Please enter the 6-digit code.");
        setIsLoading(false);
        return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            otpCode: otpValue,
            newPassword,
            confirmPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password.");
      }

      setIsSuccess(true);
      
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <FieldGroup className="p-6 md:p-8 flex flex-col gap-6 justify-center items-center text-center">
                        <div className="flex items-center justify-center">
                            <Check strokeWidth={3} className='size-16 p-2.5 text-white bg-green-500 rounded-full'/>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Password Reset</h1>
                            <p className="text-muted-foreground text-sm">
                                Your password has been successfully reset.
                            </p>
                        </div>
                        <Button asChild className="w-full">
                            <a href="/login">Go to Login</a>
                        </Button>
                    </FieldGroup>
                    <div className="bg-muted relative hidden md:block">
                        <img
                        src="https://images.pexels.com/photos/7792743/pexels-photo-7792743.jpeg"
                        alt="Image"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <p className="text-muted-foreground text-balance">
                  Enter the code sent to {email} and your new password.
                </p>
              </div>

              {/* OTP */}
              <Field>
                <FieldLabel className="text-center w-full block">Verification Code</FieldLabel>
                <InputOTP 
                    maxLength={6} 
                    value={otpValue}
                    onChange={(val) => setOtpValue(val)}
                    containerClassName="justify-center mb-2"
                >
                    <InputOTPGroup>
                        <InputOTPSlot index={0} className='p-4 text-lg font-semibold'/>
                        <InputOTPSlot index={1} className='p-4 text-lg font-semibold'/>
                        <InputOTPSlot index={2} className='p-4 text-lg font-semibold'/>
                        <InputOTPSlot index={3} className='p-4 text-lg font-semibold'/>
                        <InputOTPSlot index={4} className='p-4 text-lg font-semibold'/>
                        <InputOTPSlot index={5} className='p-4 text-lg font-semibold'/>
                    </InputOTPGroup>
                </InputOTP>
              </Field>

              {/* New Password */}
              <Field>
                  <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="new-password"
                      name="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        variant="ghost"
                        className="hover:bg-transparent text-muted-foreground hover:text-foreground"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
              </Field>

              {/* Confirm Password */}
              <Field>
                  <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="confirm-password"
                      name="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        variant="ghost"
                        className="hover:bg-transparent text-muted-foreground hover:text-foreground"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? <Eye className="size-4" /> : <EyeClosed className="size-4" />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
              </Field>

              {/* Submit button */}
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <LoaderCircleIcon className="animate-spin size-4" />
                  ) : null}
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
                {error && (
                  <FieldError className="text-center">{error}</FieldError>
                )}
              </Field>

              <FieldDescription className="text-center">
                 <a href="/login">Back to Login</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.pexels.com/photos/7792743/pexels-photo-7792743.jpeg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}