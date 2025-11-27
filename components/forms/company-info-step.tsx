"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs text-gray-600">
          {stepNumber}
        </span>
        Company Profile
      </h3>

      <div className="space-y-2">
        <Label htmlFor="companyName">Legal Company Name</Label>
        <Input
          id="companyName"
          {...register("companyName")}
          placeholder="e.g. Global Tech Solutions Ltd."
        />
        {errors.companyName && (
          <p className="text-red-500 text-xs">
            {errors.companyName.message as string}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="businessType">Business Type</Label>
          <select
            id="businessType"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("businessType")}
          >
            <option value="">Select Type</option>
            <option value="Manufacturer">Manufacturer (Factory)</option>
            <option value="Trading Company">Trading Company</option>
            <option value="Distributor">Distributor / Wholesaler</option>
            <option value="Individual">Individual / Solo Seller</option>
          </select>
          {errors.businessType && (
            <p className="text-red-500 text-xs">
              {errors.businessType.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country/Region</Label>
          <select
            id="country"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("country")}
          >
            <option value="">Select Country</option>
            <option value="Cambodia">Cambodia</option>
            <option value="USA">USA</option>
            <option value="China">China</option>
            <option value="Thailand">Thailand</option>
            <option value="Vietnam">Vietnam</option>
          </select>
          {errors.country && (
            <p className="text-red-500 text-xs">
              {errors.country.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Business Phone Number</Label>
        <Input
          id="phone"
          {...register("phone")}
          placeholder="+855 12 345 678"
        />
        <p className="text-[10px] text-gray-400">
          This will be used for official verification calls.
        </p>
        {errors.phone && (
          <p className="text-red-500 text-xs">
            {errors.phone.message as string}
          </p>
        )}
      </div>
    </div>
  );
}
