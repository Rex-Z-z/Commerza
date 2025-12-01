// app/(main)/become-supplier/page.tsx
import React from "react";
import BecomeSupplierForm from "@/components/forms/become-supplier-form";
import { CheckCircle2 } from "lucide-react";

export default function BecomeSupplierPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#139ED3] mb-3">
            Start Selling to Millions of Buyers
          </h1>
          <p className="text-gray-600 text-lg">
            Create your company profile and join the world's leading B2B
            marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDE: The Value Proposition (Sales Pitch) */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
            {/* Trust Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Why sell on Commerza?
              </h3>
              <ul className="space-y-4">
                <FeatureItem
                  title="Global Reach"
                  desc="Access active buyers in over 190 countries and regions."
                />
                <FeatureItem
                  title="Smart Analytics"
                  desc="Get insights on who is visiting your store and what they want."
                />
                <FeatureItem
                  title="Secure Transactions"
                  desc="Our Trade Assurance protects your payments and orders."
                />
                <FeatureItem
                  title="Verified Badge"
                  desc="Stand out from competitors with the Verified Supplier tag."
                />
              </ul>
            </div>

            {/* Testimonial (Optional - adds trust) */}
            <div className="bg-[#139ED3]/10 p-6 rounded-xl border border-[#139ED3]/20">
              <p className="italic text-gray-700 mb-4">
                "Since joining as a supplier, our export sales have increased by
                300% in just one year. The platform is incredibly easy to use."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div>
                  <p className="font-semibold text-sm">Sarah Chen</p>
                  <p className="text-xs text-gray-500">
                    CEO, Chen Textiles Ltd.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: The Form Component */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-8">
                <BecomeSupplierForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small helper component for the features list
function FeatureItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="mt-1">
        <CheckCircle2 className="w-5 h-5 text-[#139ED3]" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
