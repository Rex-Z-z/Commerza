"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { CompanyInfoStep } from "./company-info-step";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createCompanyAction } from "@/app/actions/company"; // Import the new action

// --- VALIDATION SCHEMA ---
const upgradeSchema = z.object({
  companyName: z.string().min(3, "Company name is required"),
  taxId: z.string().min(3, "Tax ID is required"),
  industryType: z.string().min(1, "Industry type is required"),
  phoneNumber: z.string().min(5, "Phone number is required"),
  description: z.string().optional(),
  
  // Address
  addressLine1: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  stateProvince: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  
  // File Validation
  logo: z.any().optional(),
});

export default function BecomeSupplierForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // We rely on the server to check auth via cookies, 
  // but for UI toggle we can check if the cookie exists or use a context.
  // For now, we assume the user is on this page because middleware let them in.

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(upgradeSchema),
  });

  const onSubmit = (data: any) => {
    startTransition(async () => {
      try {
        const formData = new FormData();

        // 1. Prepare JSON Data
        const requestData = {
          companyName: data.companyName,
          industryType: data.industryType,
          taxId: data.taxId,
          phoneNumber: data.phoneNumber,
          description: data.description,
          addressLine1: data.addressLine1,
          city: data.city,
          stateProvince: data.stateProvince,
          postalCode: data.postalCode,
          country: data.country
        };

        // 2. Append JSON string directly. The Server Action will wrap it in a Blob.
        formData.append("request", JSON.stringify(requestData));

        // 3. Append File
        if (data.logo && data.logo.length > 0) {
          formData.append("logo", data.logo[0]);
        }

        // 4. Call Server Action
        const result = await createCompanyAction(null, formData);

        if (result.error) {
           toast.error(result.error);
           return;
        }

        toast.success("Success! You are now a supplier.");
        // Redirect to dashboard or logout to refresh roles in token
        router.push("/dashboard"); 

      } catch (error: any) {
        console.error(error);
        toast.error("An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Register Company</h2>
        <p className="text-sm text-gray-500 mt-1">
          Provide your business details and official Tax ID to become a supplier.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
        <CompanyInfoStep
          register={register}
          errors={errors}
          stepNumber="1"
        />

        <Button
          type="submit"
          className="w-full bg-[#139ED3] hover:bg-[#118bbd] text-white py-6 text-lg"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </form>
    </div>
  );
}