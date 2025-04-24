"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, AtSign, Lock, LogIn, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { useUserStore } from "@/store/user"

export function LoginForm() {
  const router = useRouter()
  const { setUser } = useUserStore()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    general?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: typeof errors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    setIsSubmitting(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/users/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(formData),
        credentials: "include",
      })
      if (!res.ok) {
        // Invalid credentials
        setErrors({
          general: "Invalid email or password. Please try again.",
        })
        return
      }
      const body = await res.json()
      setUser(body.userId)
      router.push("/")
    } catch (error) {
      setErrors({
        general: "An error occurred. Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }


  return (<div className="w-full max-w-md p-8 rounded-xl bg-gray-800 shadow-xl">
    <div className="flex flex-col items-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center mb-4">
        <LogIn className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-2xl font-bold">Welcome Back</h1>
      <p className="text-gray-400 mt-2 text-center">Sign in to continue to your account</p>
    </div>

    {errors.general && (
      <Alert className="mb-6 border-red-400 bg-red-400/20 text-red-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{errors.general}</AlertDescription>
      </Alert>
    )}

    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className={errors.email ? "text-red-400" : ""}>
          Email
        </Label>
        <div className="relative">
          <AtSign className={`absolute left-3 top-3 h-4 w-4 ${errors.email ? "text-red-400" : "text-gray-400"}`} />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            className={`pl-10 bg-gray-700 border-gray-600 text-white ${errors.email ? "border-red-400 focus-visible:ring-red-400" : ""
              }`}
          />
        </div>
        {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="password" className={errors.password ? "text-red-400" : ""}>
            Password
          </Label>
          <Link href="/forgot-password" className="text-sm text-blue-400 hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className={`absolute left-3 top-3 h-4 w-4 ${errors.password ? "text-red-400" : "text-gray-400"}`} />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className={`pl-10 bg-gray-700 border-gray-600 text-white ${errors.password ? "border-red-400 focus-visible:ring-red-400" : ""
              }`}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3">
            {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password}</p>}
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing In..." : "Sign In"}
      </Button>

      <div className="flex items-center gap-4 my-6">
        <Separator className="flex-1 bg-gray-600" />
        <span className="text-sm text-gray-400">OR</span>
        <Separator className="flex-1 bg-gray-600" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button onClick={() => {
          window.location.href = "http://localhost:4000/api/v1/users/register-google"
        }} variant="outline" className="cursor-pointer bg-gray-700 border-gray-600 hover:bg-gray-600">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
          Google
        </Button>
        <Button variant="outline" className="cursor-pointer bg-gray-700 border-gray-600 hover:bg-gray-600">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
          </svg>
          Facebook
        </Button>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  </div>
  )
}

