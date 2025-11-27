import React from "react";
import VerifyCompanyForm from "@/components/forms/verify-company-form";
import { ShieldCheck, Lock, Globe } from "lucide-react";

export default function VerifyCompanyPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Business Verification
          </h1>
          <p className="text-gray-500 mt-2">
            Verify your company to unlock selling features and gain the{" "}
            <span className="font-semibold text-[#139ED3]">
              Verified Supplier
            </span>{" "}
            badge.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Column */}
          <div className="lg:col-span-2">
            <VerifyCompanyForm />
          </div>

          {/* Sidebar Info Column */}
          <div className="space-y-6">
            {/* Benefits Card */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Why Verify?</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Build Buyer Trust
                    </p>
                    <p className="text-xs text-gray-500">
                      Verified suppliers get 40% more inquiries.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Globe className="w-5 h-5 text-[#139ED3] shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Unlimited Listings
                    </p>
                    <p className="text-xs text-gray-500">
                      Remove the 5-product limit restriction.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Lock className="w-5 h-5 text-orange-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Data Protection
                    </p>
                    <p className="text-xs text-gray-500">
                      Your documents are encrypted and stored securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                Need Help?
              </h4>
              <p className="text-xs text-blue-700 mb-3">
                If you are unsure which documents to upload, please contact our
                merchant support team.
              </p>
              <button className="text-xs font-semibold text-[#139ED3] hover:underline">
                Contact Support &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
