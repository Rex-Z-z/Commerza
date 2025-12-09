"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface CompanyInfoProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  stepNumber: string;
}

export function CompanyInfoStep({
  register,
  errors,
  stepNumber,
}: CompanyInfoProps) {
  return (
    <div className="space-y-6">
      
      {/* --- BASIC INFO --- */}
      <div className="space-y-4 pb-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs text-gray-600">
            {stepNumber}
          </span>
          Company Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name <span className="text-red-500">*</span></Label>
            <Input id="companyName" {...register("companyName")} placeholder="Legal Business Name" />
            {errors.companyName && <p className="text-red-500 text-xs">{errors.companyName.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID / VAT No. <span className="text-red-500">*</span></Label>
            <Input id="taxId" {...register("taxId")} placeholder="e.g. 123-456-789" />
            {errors.taxId && <p className="text-red-500 text-xs">{errors.taxId.message as string}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industryType">Industry Type <span className="text-red-500">*</span></Label>
            <select
                id="industryType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register("industryType")}
            >
                <option value="">Select Industry</option>
                <option value="Electronics">Electronics</option>
                <option value="Apparel">Apparel</option>
                <option value="Machinery">Machinery</option>
            </select>
            {errors.industryType && <p className="text-red-500 text-xs">{errors.industryType.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Business Phone <span className="text-red-500">*</span></Label>
            <Input id="phoneNumber" {...register("phoneNumber")} placeholder="+855 12 345 678" />
            {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber.message as string}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} placeholder="Describe your business..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo">Company Logo (Upload)</Label>
          <Input 
            id="logo" 
            type="file" 
            accept="image/*" 
            className="cursor-pointer"
            {...register("logo")} 
           />
           <p className="text-[10px] text-gray-400">Supported formats: JPG, PNG, WEBP.</p>
        </div>
      </div>

      {/* --- ADDRESS --- */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Business Address</h3>
        
        <div className="space-y-2">
            <Label htmlFor="addressLine1">Address Line 1 <span className="text-red-500">*</span></Label>
            <Input id="addressLine1" {...register("addressLine1")} placeholder="Street, P.O. Box" />
            {errors.addressLine1 && <p className="text-red-500 text-xs">{errors.addressLine1.message as string}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
                <Input id="country" {...register("country")} />
                {errors.country && <p className="text-red-500 text-xs">{errors.country.message as string}</p>}
             </div>
             <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                <Input id="city" {...register("city")} />
                {errors.city && <p className="text-red-500 text-xs">{errors.city.message as string}</p>}
             </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <Label htmlFor="stateProvince">State/Province</Label>
                <Input id="stateProvince" {...register("stateProvince")} />
             </div>
             <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code <span className="text-red-500">*</span></Label>
                <Input id="postalCode" {...register("postalCode")} />
                {errors.postalCode && <p className="text-red-500 text-xs">{errors.postalCode.message as string}</p>}
             </div>
        </div>
      </div>
    </div>
  );
}