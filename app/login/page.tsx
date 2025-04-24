import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 flex items-center justify-center p-4">
        <LoginForm />
      </div>
    </div>
  )
}

