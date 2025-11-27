"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileText, Loader2, AlertCircle } from "lucide-react";

// --- Validation Schema ---
const verifyCompanySchema = z.object({
  registrationNumber: z.string().min(5, "Registration/Tax ID is required"),
  companyAddress: z
    .string()
    .min(10, "Please enter the full registered address"),
  establishedDate: z.string().min(1, "Establishment date is required"),
  website: z.string().optional(),
});

export default function VerifyCompanyForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyCompanySchema),
  });

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLicenseFile(file);
      // Create a fake preview URL for the UI
      setLicensePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: any) => {
    if (!licenseFile) {
      alert("Please upload your Business License document.");
      return;
    }

    setIsLoading(true);
    console.log("Legal Data:", data);
    console.log("Document:", licenseFile.name);

    // Simulate API Upload
    await new Promise((resolve) => setTimeout(resolve, 2500));

    alert(
      "Application Submitted! Our legal team will review it within 2-3 business days."
    );
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SECTION 1: Legal Details */}
        <div className="space-y-4">
          <div className="border-b pb-2 mb-4">
            <h3 className="font-semibold text-gray-900 text-lg">
              1. Legal Information
            </h3>
            <p className="text-sm text-gray-500">
              Must match your government documents exactly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Business Registration No. / Tax ID</Label>
              <Input
                {...register("registrationNumber")}
                placeholder="e.g. 100-239-4492"
              />
              {errors.registrationNumber && (
                <p className="text-red-500 text-xs">
                  {errors.registrationNumber.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date Established</Label>
              <Input type="date" {...register("establishedDate")} />
              {errors.establishedDate && (
                <p className="text-red-500 text-xs">
                  {errors.establishedDate.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Registered Company Address</Label>
            <Textarea
              {...register("companyAddress")}
              placeholder="Enter the full address as it appears on your license"
              className="min-h-[80px]"
            />
            {errors.companyAddress && (
              <p className="text-red-500 text-xs">
                {errors.companyAddress.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Company Website (Optional)</Label>
            <Input
              {...register("website")}
              placeholder="https://www.yourcompany.com"
            />
          </div>
        </div>

        {/* SECTION 2: Documents */}
        <div className="space-y-4">
          <div className="border-b pb-2 mb-4">
            <h3 className="font-semibold text-gray-900 text-lg">
              2. Documentation
            </h3>
            <p className="text-sm text-gray-500">
              Upload clear copies of your official documents.
            </p>
          </div>

          {/* Business License Upload Area */}
          <div className="space-y-3">
            <Label>
              Business License / Certificate of Incorporation{" "}
              <span className="text-red-500">*</span>
            </Label>

            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all hover:bg-gray-50 relative flex flex-col items-center justify-center ${
                licensePreview
                  ? "border-[#139ED3] bg-blue-50/30"
                  : "border-gray-300"
              }`}
            >
              <input
                type="file"
                accept=".pdf,.jpg,.png,.jpeg"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
              />

              {licensePreview ? (
                <div className="flex flex-col items-center">
                  <FileText className="w-12 h-12 text-[#139ED3] mb-2" />
                  <p className="text-sm font-medium text-[#139ED3]">
                    {licenseFile?.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Click to change file
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-gray-100 p-4 rounded-full mb-3">
                    <UploadCloud className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    <span className="text-[#139ED3]">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, JPG or PNG (Max 10MB)
                  </p>
                </>
              )}
            </div>
            <p className="text-[11px] text-gray-400">
              * Ensure the company name and address are clearly visible.
            </p>
          </div>
        </div>

        {/* Warning Box */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
          <div className="mt-0.5">
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-800">
              Verification Process
            </h4>
            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
              Your documents will be reviewed by our compliance team. This
              typically takes 1-3 business days. During this time, you can
              prepare your store, but your products will not be visible to
              buyers.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full bg-[#139ED3] hover:bg-[#118bbd] text-white py-6 text-lg font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading
                Documents...
              </>
            ) : (
              "Submit for Verification"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
