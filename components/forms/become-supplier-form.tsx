"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { UserInfoStep } from "./user-info-step";
import { CompanyInfoStep } from "./company-info-step";

const useMockAuth = () => {
  // Case 1: Guest (Value is null)
  const user = null;

  // Case 2: Logged In Buyer (Value is an object)
  //   const user = { id: 1, name: "John Doe", role: "user" };

  // Case 3: Individual Seller (Value is an object)
  //   const user = { id: 2, name: "Seller Jane", role: "individual_seller" };

  return {
    user,
    isAuthenticated: !!user,
  };
};

// --- VALIDATION SCHEMAS ---
const guestSchema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    companyName: z.string().min(3),
    businessType: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().min(5),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loggedInSchema = z.object({
  companyName: z.string().min(3),
  businessType: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().min(5),
});

export default function BecomeSupplierForm() {
  const { user, isAuthenticated } = useMockAuth();
  const [isLoading, setIsLoading] = useState(false);
  const activeSchema = isAuthenticated ? loggedInSchema : guestSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(activeSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    if (!isAuthenticated) {
      console.log("LOGIC: Register User + Create Company");
      console.log("User Data:", { email: data.email, pass: data.password });
      console.log("Company Data:", { name: data.companyName });
    } else {
      console.log("LOGIC: Create Company & Link to Current User ID");
      console.log("Current User:", user);
      console.log("Company Data:", { name: data.companyName });
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert("Form Submitted! Check Console for Logic.");
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {isAuthenticated
            ? "Upgrade to Supplier Account"
            : "Create Supplier Account"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {isAuthenticated
            ? "Enter your company details below to start selling."
            : "Complete the form below to register your company."}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
        {/* LOGIC: Only show User Info if Guest */}
        {!isAuthenticated && (
          <UserInfoStep register={register} errors={errors} />
        )}

        {/* LOGIC: Always show Company Info */}
        {/* If logged in, this is Step 1. If guest, this is Step 2. */}
        <CompanyInfoStep
          register={register}
          errors={errors}
          stepNumber={isAuthenticated ? "1" : "2"}
        />

        <Button
          type="submit"
          className="w-full bg-[#139ED3] hover:bg-[#118bbd] text-white py-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              {" "}
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...{" "}
            </>
          ) : isAuthenticated ? (
            "Register Company"
          ) : (
            "Create Account & Register"
          )}
        </Button>
      </form>
    </div>
  );
}
