"use client"

import type React from "react"

import { useState } from "react"
import {
    User,
    FileText,
    PawPrintIcon as Paw,
    Calendar,
    AlertCircle,
    CheckCircle,
    CalendarDays,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUploader from "./ui/image-upload"
import { StatusCodes } from "http-status-codes"
import { useRouter, useSearchParams } from "next/navigation"
import { fetchWithAuth } from "@/lib/api/fetchWithAuth"
import { useUserStore } from "@/store/user"

// Dog breeds for the dropdown
const DOG_BREEDS = [
    "Labrador Retriever",
    "German Shepherd",
    "Golden Retriever",
    "French Bulldog",
    "Bulldog",
    "Poodle",
    "Beagle",
    "Rottweiler",
    "Dachshund",
    "Siberian Husky",
    "Shih Tzu",
    "Chihuahua",
    "Boxer",
    "Pomeranian",
    "Border Collie",
    "Great Dane",
    "Australian Shepherd",
    "Doberman Pinscher",
    "Cavalier King Charles Spaniel",
    "Yorkshire Terrier",
    "Other",
]
const today = new Date()
const maxDate = today.toISOString().split("T")[0]
export function ProfileSetupForm() {
    const { userId } = useUserStore()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        dogBreed: "",
        dogName: "",
        dogAge: "",
        birthDate: ""
    })

    // for user avatar 
    const [userAvatar, setUserAvatar] = useState<string | null>(null)
    const [userAvatarFile, setUserAvatarFile] = useState<File | null>(null)

    // for dog avatar
    const [dogAvatar, setDogAvatar] = useState<string | null>(null)
    const [dogAvatarFile, setDogAvatarFile] = useState<File | null>(null)



    const [errors, setErrors] = useState<{
        name?: string
        bio?: string
        dogBreed?: string
        dogName?: string
        dogAge?: string
        avatar?: string
        general?: string
        birthDate?: string
        dogAvatar?: string
    }>({})

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear errors when user types
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }

    const handleSelectChange = (value: string, name: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear errors when user selects
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }))
        }
    }



    const validateForm = () => {
        const newErrors: typeof errors = {}

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        }

        // Description validation (optional but if provided, should be at least 10 chars)
        if (formData.bio && formData.bio.length < 10) {
            newErrors.bio = "Description should be at least 10 characters"
        }

        // Dog breed validation
        if (!formData.dogBreed) {
            newErrors.dogBreed = "Dog breed is required"
        }

        // Dog name validation
        if (!formData.dogName.trim()) {
            newErrors.dogName = "Dog name is required"
        }

        // Dog age validation
        if (!formData.dogAge) {
            newErrors.dogAge = "Dog age is required"
        } else {
            const age = Number.parseInt(formData.dogAge)
            if (isNaN(age) || age <= 0 || age > 30) {
                newErrors.dogAge = "Please enter a valid age between 1 and 30"
            }
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
            const uploadFormData = new FormData()
            uploadFormData.append("userPic", userAvatarFile!)
            uploadFormData.append("dogPic", dogAvatarFile!)
            uploadFormData.append("userInfo", JSON.stringify(formData));
            const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URI}/user-info`, {
                method: "PATCH",
                body: uploadFormData,
            }, true, false)
            const data = await res.json()
            if (!res.ok) {
                if (res.status === StatusCodes.UNPROCESSABLE_ENTITY) {
                    setErrors({
                        general: "Please fill all the required fields",
                        ...data.error
                    })
                } else if (res.status === StatusCodes.UNAUTHORIZED) {
                    setErrors({
                        general: "You are not authenticated. Please log in.",
                    })
                } else if (res.status === StatusCodes.BAD_REQUEST) {
                    setErrors({
                        general: data.error,
                    })
                } else {
                    setErrors({
                        general: "An error occurred. Please try again.",
                    })
                }
                return
            }
            setIsSuccess(true)
            // redirect to home page
            router.push("/")
        } catch (error) {
            setErrors({
                general: "An error occurred. Please try again.",
            })
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6 md:p-8 rounded-xl bg-gray-800 shadow-xl">
            <div className="flex flex-col items-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full flex items-center justify-center mb-4">
                    <Paw className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold">Complete Your Profile</h1>
                <p className="text-gray-400 mt-2 text-center">Tell us about yourself and your furry friend</p>
            </div>

            {errors.general && (
                <Alert className="mb-6 border-red-400 bg-red-400/20 text-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.general}</AlertDescription>
                </Alert>
            )}

            {isSuccess && (
                <Alert className="mb-6 border-green-400 bg-green-400/20 text-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Profile created successfully! Redirecting...</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Upload Section */}
                <div className="flex items-center justify-center w-full mb-6 space-x-5">
                    <ImageUploader image={userAvatar} onChange={(file, preview) => {
                        setUserAvatarFile(file)
                        setUserAvatar(preview)
                    }} error={errors.avatar} label="Profile Picture" />
                    <ImageUploader image={dogAvatar} onChange={(file, preview) => {
                        setDogAvatarFile(file)
                        setDogAvatar(preview)
                    }} error={errors.dogAvatar} label="Dog Picture" />
                </div>


                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column - User Info */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-medium border-b border-gray-700 pb-2">Your Information</h3>

                        <div className="space-y-2">
                            <Label htmlFor="name" className={errors.name ? "text-red-400" : ""}>
                                Your Name
                            </Label>
                            <div className="relative">
                                <User className={`absolute left-3 top-3 h-4 w-4 ${errors.name ? "text-red-400" : "text-gray-400"}`} />
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`pl-10 bg-gray-700 border-gray-600 text-white ${errors.name ? "border-red-400 focus-visible:ring-red-400" : ""
                                        }`}
                                />
                            </div>
                            {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="birthdate" className={errors.birthDate ? "text-red-400" : ""}>
                                Birth Date
                            </Label>
                            <div className="relative">
                                <CalendarDays
                                    className={`absolute left-3 top-3 h-4 w-4 ${errors.birthDate ? "text-red-400" : "text-gray-400"}`}
                                />
                                <Input
                                    id="birthdate"
                                    name="birthDate"
                                    type="date"
                                    max={maxDate}
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    className={`pl-10 bg-gray-700 border-gray-600 text-white ${errors.birthDate ? "border-red-400 focus-visible:ring-red-400" : ""
                                        }`}
                                />
                            </div>
                            {errors.birthDate ? (
                                <p className="text-sm text-red-400 mt-1">{errors.birthDate}</p>
                            ) : (
                                <p className="text-xs text-gray-400 mt-1">You must be at least 18 years old</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio" className={errors.bio ? "text-red-400" : ""}>
                                Bio
                            </Label>
                            <div className="relative">
                                <FileText
                                    className={`absolute left-3 top-3 h-4 w-4 ${errors.bio ? "text-red-400" : "text-gray-400"}`}
                                />
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    placeholder="Tell us about yourself..."
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className={`pl-10 min-h-[120px] bg-gray-700 border-gray-600 text-white ${errors.bio ? "border-red-400 focus-visible:ring-red-400" : ""
                                        }`}
                                />
                            </div>
                            {errors.bio && <p className="text-sm text-red-400 mt-1">{errors.bio}</p>}
                        </div>
                    </div>

                    {/* Right Column - Dog Info */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-medium border-b border-gray-700 pb-2">Your Dog&apos;s Information</h3>

                        <div className="space-y-2">
                            <Label htmlFor="dogName" className={errors.dogName ? "text-red-400" : ""}>
                                Dog Name
                            </Label>
                            <div className="relative">
                                <Paw
                                    className={`absolute left-3 top-3 h-4 w-4 ${errors.dogName ? "text-red-400" : "text-gray-400"}`}
                                />
                                <Input
                                    id="dogName"
                                    name="dogName"
                                    placeholder="Buddy"
                                    value={formData.dogName}
                                    onChange={handleChange}
                                    className={`pl-10 bg-gray-700 border-gray-600 text-white ${errors.dogName ? "border-red-400 focus-visible:ring-red-400" : ""
                                        }`}
                                />
                            </div>
                            {errors.dogName && <p className="text-sm text-red-400 mt-1">{errors.dogName}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dogBreed" className={errors.dogBreed ? "text-red-400" : ""}>
                                Dog Breed
                            </Label>
                            <Select value={formData.dogBreed} onValueChange={(value) => handleSelectChange(value, "dogBreed")}>
                                <SelectTrigger
                                    id="dog_breed"
                                    className={`bg-gray-700 border-gray-600 text-white ${errors.dogBreed ? "border-red-400 focus-visible:ring-red-400" : ""
                                        }`}
                                >
                                    <SelectValue placeholder="Select a breed" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                                    {DOG_BREEDS.map((breed) => (
                                        <SelectItem key={breed} value={breed}>
                                            {breed}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.dogBreed && <p className="text-sm text-red-400 mt-1">{errors.dogBreed}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dogAge" className={errors.dogAge ? "text-red-400" : ""}>
                                Dog Age (years)
                            </Label>
                            <div className="relative">
                                <Calendar
                                    className={`absolute left-3 top-3 h-4 w-4 ${errors.dogAge ? "text-red-400" : "text-gray-400"}`}
                                />
                                <Input
                                    id="dogAge"
                                    name="dogAge"
                                    type="number"
                                    min="1"
                                    max="30"
                                    placeholder="3"
                                    value={formData.dogAge}
                                    onChange={handleChange}
                                    className={`pl-10 bg-gray-700 border-gray-600 text-white ${errors.dogAge ? "border-red-400 focus-visible:ring-red-400" : ""
                                        }`}
                                />
                            </div>
                            {errors.dogAge && <p className="text-sm text-red-400 mt-1">{errors.dogAge}</p>}
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
                    disabled={isSubmitting || isSuccess}
                >
                    {isSubmitting ? "Saving..." : "Complete Profile"}
                </Button>
            </form>
        </div>
    )
}

