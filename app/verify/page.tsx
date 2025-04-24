import { OtpVerificationForm } from "@/components/otp-verification-form"

export default function VerifyOtpPage() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex items-center justify-center p-4">
        <OtpVerificationForm />
      </div>
    </div>
  )
}

