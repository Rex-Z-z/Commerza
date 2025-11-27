"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Camera, Loader2, CheckCircle } from "lucide-react";

// --- Validation Schema ---
const verifySchema = z.object({
  legalName: z.string().min(2, "Name matches ID is required"),
  dob: z.string().min(1, "Date of birth is required"),
  idType: z.string().min(1, "Select ID type"),
  idNumber: z.string().min(5, "ID Number is required"),
  // Note: File validation in Zod is tricky on client-side.
  // We usually validate file size/type in the onSubmit handler or use a custom component.
});

export default function VerifyIdentityForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifySchema),
  });

  // Mock function to handle file preview
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setPreview: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const onSubmit = async (data: any) => {
    if (!frontImage || !selfieImage) {
      alert("Please upload both ID and Selfie photos.");
      return;
    }

    setIsLoading(true);
    console.log("Identity Data:", data);
    console.log("Images ready for upload...");

    // Simulate API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert("Verification Submitted! We will review within 24 hours.");
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Verify Your Identity
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          To start selling as an Individual, we need to confirm you are a real
          person.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SECTION 1: Personal Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-xs text-blue-600">
              1
            </span>
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Legal Name (As on ID)</Label>
              <Input {...register("legalName")} placeholder="e.g. SOKHA CHAN" />
              {errors.legalName && (
                <p className="text-red-500 text-xs">
                  {errors.legalName.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" {...register("dob")} />
              {errors.dob && (
                <p className="text-red-500 text-xs">
                  {errors.dob.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ID Document Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register("idType")}
              >
                <option value="">Select Type</option>
                <option value="National ID">National ID Card</option>
                <option value="Passport">Passport</option>
                <option value="Drivers License">Driver's License</option>
              </select>
              {errors.idType && (
                <p className="text-red-500 text-xs">
                  {errors.idType.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>ID Number</Label>
              <Input {...register("idNumber")} placeholder="e.g. 123456789" />
              {errors.idNumber && (
                <p className="text-red-500 text-xs">
                  {errors.idNumber.message as string}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Document Upload */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-xs text-blue-600">
              2
            </span>
            Document Upload
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID Card Upload Box */}
            <div className="space-y-2">
              <Label>Photo of ID Card (Front)</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all hover:bg-gray-50 relative h-48 flex flex-col items-center justify-center ${
                  frontImage ? "border-[#139ED3]" : "border-gray-300"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e, setFrontImage)}
                />

                {frontImage ? (
                  <img
                    src={frontImage}
                    alt="ID Front"
                    className="h-full w-full object-cover rounded-md"
                  />
                ) : (
                  <>
                    <div className="bg-blue-50 p-3 rounded-full mb-2">
                      <UploadCloud className="w-6 h-6 text-[#139ED3]" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload ID
                    </p>
                    <p className="text-xs text-gray-400">JPG, PNG (Max 5MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Selfie Upload Box */}
            <div className="space-y-2">
              <Label>Selfie with ID Card</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all hover:bg-gray-50 relative h-48 flex flex-col items-center justify-center ${
                  selfieImage ? "border-[#139ED3]" : "border-gray-300"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => handleFileChange(e, setSelfieImage)}
                />

                {selfieImage ? (
                  <img
                    src={selfieImage}
                    alt="Selfie"
                    className="h-full w-full object-cover rounded-md"
                  />
                ) : (
                  <>
                    <div className="bg-blue-50 p-3 rounded-full mb-2">
                      <Camera className="w-6 h-6 text-[#139ED3]" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      Take a selfie holding ID
                    </p>
                    <p className="text-xs text-gray-400">
                      Make sure face is clear
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md flex gap-3">
          <div className="mt-1">
            <CheckCircle className="w-4 h-4 text-yellow-600" />
          </div>
          <p className="text-xs text-yellow-800 leading-relaxed">
            By submitting this form, you agree that Commerza may process your ID
            data for verification purposes. This data is encrypted and secure.
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#139ED3] hover:bg-[#118bbd] text-white py-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
            </>
          ) : (
            "Submit Verification"
          )}
        </Button>
      </form>
    </div>
  );
}
