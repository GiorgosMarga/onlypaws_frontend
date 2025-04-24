"use client"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Shield, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"


export function OtpVerificationForm() {
    const router = useRouter()
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
    const [error, setError] = useState<string | null>(null)
    const [isVerifying, setIsVerifying] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [resendCountdown, setResendCountdown] = useState(0)

    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        const generateOtp = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/users/send-otp`, {
                credentials: "include",
            })
            const data = await res.json()
            if (!res.ok) {
                setError(data?.error?.message)
                return
            }
            setError("For testing: " + data.otp.otp)
        }
        generateOtp()
    }, [])

    // Handle countdown for resend button
    useEffect(() => {
        if (resendCountdown > 0) {
            const timer = setTimeout(() => {
                setResendCountdown((prev) => prev - 1)
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [resendCountdown])

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return

        // Clear error when user types
        if (error) setError(null)

        // Update OTP array
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }

        // Handle paste event
        if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            navigator.clipboard.readText().then((text) => {
                const digits = text.replace(/\D/g, "").split("").slice(0, 6)
                if (digits.length) {
                    const newOtp = [...otp]
                    digits.forEach((digit, i) => {
                        if (i < 6) newOtp[i] = digit
                    })
                    setOtp(newOtp)

                    // Focus the next empty input or the last input
                    const nextEmptyIndex = newOtp.findIndex((val) => !val)
                    if (nextEmptyIndex !== -1) {
                        inputRefs.current[nextEmptyIndex]?.focus()
                    } else {
                        inputRefs.current[5]?.focus()
                    }
                }
            })
        }
    }

    const handleResendOtp = async () => {
        setIsResending(true)
        setError(null)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/users/send-otp`, {
                credentials: "include",
            })
            // Start countdown
            setResendCountdown(60)
            const data = await res.json()
            if (!res.ok) {
                setError(data?.error?.message)
                return
            }
            setError("For testing: " + data.otp.otp)
            // Show success message or update state
            console.log("OTP resent successfully")
        } catch (err) {
            setError("Failed to resend OTP. Please try again.")
            console.error(err)
        } finally {
            setIsResending(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Check if OTP is complete
        if (otp.some((digit) => !digit)) {
            setError("Please enter the complete verification code.")
            return
        }

        setIsVerifying(true)
        setError(null)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/users/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    otp: parseInt(otp.join(""))
                }),
                credentials: "include",
            })

            if (!res.ok) {
                setError("Invalid verification code. Please try again.")
            } else {
                setIsVerified(true)
                router.push("/profile-setup")
            }
        } catch (err) {
            setError("Verification failed. Please try again.")
            console.error(err)
        } finally {
            setIsVerifying(false)
        }
    }

    return (
        <div className="w-full max-w-md p-8 rounded-xl bg-gray-800 shadow-xl">
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold">Verify Your Account</h1>
                <p className="text-gray-400 mt-2 text-center">{"We've sent a verification code to your email"}</p>
            </div>

            {error && (
                <Alert className="mb-6 border-red-400 bg-red-400/20 text-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {isVerified && (
                <Alert className="mb-6 border-green-400 bg-green-400/20 text-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Verification successful! Redirecting...</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Verification Code</label>
                        <span className="text-xs text-gray-400">6 digits</span>
                    </div>

                    <div className="flex gap-2 justify-between">
                        {otp.map((digit, index) => (
                            <Input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center text-lg bg-gray-700 border-gray-600 text-white"
                            />
                        ))}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
                    disabled={isVerifying || isVerified}
                >
                    {isVerifying ? "Verifying..." : "Verify Account"}
                </Button>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-400">
                        Didn&apos;t receive the code?{" "}
                        {resendCountdown > 0 ? (
                            <span className="text-gray-500">Resend in {resendCountdown}s</span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={isResending || resendCountdown > 0}
                                className="text-blue-400 hover:underline disabled:text-gray-500"
                            >
                                {isResending ? "Sending..." : "Resend Code"}
                            </button>
                        )}
                    </p>
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-400">
                        <Link href="/login" className="text-blue-400 hover:underline">
                            Back to Login
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

