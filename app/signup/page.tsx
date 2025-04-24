import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex items-center justify-center p-4">
        <SignupForm />
      </div>
    </div>
  )
}

