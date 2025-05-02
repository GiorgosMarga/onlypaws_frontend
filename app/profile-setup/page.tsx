import { ProfileSetupForm } from "@/components/profile-setup-form"
import { Suspense } from "react"

export default function ProfileSetupPage() {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8 flex items-center justify-center">
            <div className="w-full py-8">
                <Suspense>
                    <ProfileSetupForm />
                </Suspense>
            </div>
        </div>
    )
}
