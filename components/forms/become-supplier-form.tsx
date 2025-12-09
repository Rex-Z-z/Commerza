"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { CompanyInfoStep } from "./company-info-step";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // <--- CHANGED: Use Sonner

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
  const [isLoading, setIsLoading] = useState(false);

  // Auth Check (Replace with your actual auth hook)
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const isAuthenticated = !!token;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(upgradeSchema),
  });

  const onSubmit = async (data: any) => {
    if (!isAuthenticated) return;

    setIsLoading(true);

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

      // 2. Append JSON as 'request' part
      formData.append(
        "request",
        new Blob([JSON.stringify(requestData)], { type: "application/json" })
      );

      // 3. Append File as 'logo' part
      if (data.logo && data.logo.length > 0) {
        formData.append("logo", data.logo[0]);
      }

      // 4. Send Request
      const response = await fetch("http://localhost:8080/api/v1/company", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}` 
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Registration failed");
      }

      const result = await response.json();
      console.log("Success:", result);
      
      // --- CHANGED: Use Sonner Toast ---
      toast.success("Success! You are now a supplier.");
      router.push("/dashboard");

    } catch (error: any) {
      console.error(error);
      toast.error("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 border rounded-lg bg-gray-50">
        <Lock className="w-10 h-10 text-gray-400" />
        <h2 className="text-xl font-semibold">Login Required</h2>
        <p className="text-gray-500">Please login to upgrade your account.</p>
        <Button onClick={() => router.push("/login")}>Login Now</Button>
      </div>
    );
  }

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
          disabled={isLoading}
        >
          {isLoading ? (
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