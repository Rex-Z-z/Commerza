"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface UserInfoProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export function UserInfoStep({ register, errors }: UserInfoProps) {
  return (
    <div className="space-y-4 pb-6 border-b border-gray-100">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs text-gray-600">
          1
        </span>
        User Information
      </h3>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          {...register("fullName")}
          placeholder="e.g. John Doe"
        />
        {errors.fullName && (
          <p className="text-red-500 text-xs">
            {errors.fullName.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="name@company.com"
        />
        {errors.email && (
          <p className="text-red-500 text-xs">
            {errors.email.message as string}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <p className="text-red-500 text-xs">
              {errors.password.message as string}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
