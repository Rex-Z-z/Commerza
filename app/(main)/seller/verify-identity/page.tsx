import React from "react";
import VerifyIdentityForm from "@/components/forms/verify-identity-form";

export default function VerifyIdentityPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto mb-8 text-center">
        {/* Optional: Add a 'Back to Dashboard' link here */}
      </div>
      <VerifyIdentityForm />
    </div>
  );
}
