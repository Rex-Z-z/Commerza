import React from "react";
import CreateSellerForm from "@/components/forms/create-seller-form";
import { Users, Shield, BadgeCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CreateSellerPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-500 mt-2">
            Expand your business by adding sellers to your verified company account.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content: The Form */}
          <div className="lg:col-span-2">
            <CreateSellerForm />
          </div>

          {/* Sidebar: Information */}
          <div className="space-y-6">
            
            <Alert className="bg-blue-50 border-blue-100">
              <BadgeCheck className="h-4 w-4 text-[#139ED3]" />
              <AlertTitle className="text-blue-900">Verified Feature</AlertTitle>
              <AlertDescription className="text-blue-700 text-xs mt-1">
                Only verified companies can add additional sellers. Ensure your business verification is approved.
              </AlertDescription>
            </Alert>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                Role Permissions
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                  <span className="text-gray-600">
                    <strong className="text-gray-900">Company Admin (You):</strong> Full access to settings, finance, and team management.
                  </span>
                </li>
                <li className="flex gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5 shrink-0" />
                  <span className="text-gray-600">
                    <strong className="text-gray-900">Seller:</strong> Can manage products, orders, and view basic analytics. Cannot edit company details.
                  </span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}