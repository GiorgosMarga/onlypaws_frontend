"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { SideNav } from "@/components/side-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Video, FileText, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react"
import { useUserStore } from "@/store/user"

export function CreatePostForm() {
    const { userId } = useUserStore()
    const [formData, setFormData] = useState({
        description: "",
        tags: "",
    })

    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [videoPreview, setVideoPreview] = useState<string | undefined>()
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))

        // Clear error when user types
        if (error) setError(null)
    }

    const handleVideoClick = () => {
        fileInputRef.current?.click()
    }

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Clear error
        if (error) setError(null)

        // Validate file size (max 100MB)
        if (file.size > 100 * 1024 * 1024) {
            setError("Video size should be less than 100MB")
            return
        }

        // Validate file type
        if (!file.type.startsWith("video/")) {
            setError("Please select a video file")
            return
        }
        setVideoFile(file)

        // Optional: generate preview URL for video player
        const previewURL = URL.createObjectURL(file)
        setVideoPreview(previewURL)
        // Simulate upload
        setIsUploading(true)
        setUploadProgress(0)

        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsUploading(false)

                    return 100
                }
                return prev + 5
            })
        }, 200)
    }

    const handleRemoveVideo = () => {
        setVideoFile(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate form
        if (!videoFile) {
            setError("Please upload a video")
            return
        }

        if (!formData.description.trim()) {
            setError("Please add a description")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const uploadFormData = new FormData()
            uploadFormData.append("media", videoFile)
            uploadFormData.append("post", JSON.stringify({ ...formData, tags: formData.tags.split(" ") }));
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URI}/posts`, {
                method: "POST",
                body: uploadFormData,
                credentials: "include"
            })
            if (!res.ok) {
                setError("Failed to create post")
                return
            }

            console.log("Post created successfully:", { ...formData, videoFile })
            setIsSuccess(true)

            // In a real app, you would redirect to the profile or home page
            window.location.href = `/profile/${userId}`
        } catch (err) {
            setError("An error occurred. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex">
            <SideNav />

            <div className="flex-1 max-w-4xl mx-auto px-4 py-6">
                <div className="flex items-center mb-6">
                    <Link href="/profile/123" className="mr-4">
                        <ArrowLeft className="h-6 w-6" />
                    </Link>
                    <h1 className="text-xl font-bold">Create New Post</h1>
                </div>

                {error && (
                    <Alert className="mb-6 border-red-400 bg-red-400/20 text-red-50">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {isSuccess && (
                    <Alert className="mb-6 border-green-400 bg-green-400/20 text-green-50">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>Post created successfully! Redirecting...</AlertDescription>
                    </Alert>
                )}

                <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Video Upload Section */}
                            <div>
                                <Label className="mb-2 block">Upload Video</Label>
                                <div
                                    className={`aspect-[9/16] bg-gray-700 border-2 border-dashed ${videoFile ? "border-gray-600" : "border-blue-400"} rounded-lg flex items-center justify-center overflow-hidden cursor-pointer relative`}
                                    onClick={!videoFile && !isUploading ? handleVideoClick : undefined}
                                >
                                    {isUploading ? (
                                        <div className="flex flex-col items-center">
                                            <div className="w-48 h-2 bg-gray-600 rounded-full overflow-hidden mb-2">
                                                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                                            </div>
                                            <p className="text-sm text-gray-300">Uploading... {uploadProgress}%</p>
                                        </div>
                                    ) : videoFile ? (
                                        <>
                                            <video src={videoPreview} className="w-full h-full object-cover" controls />
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleRemoveVideo()
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 rounded-full p-1"
                                            >
                                                <X className="w-4 h-4 text-white" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-400">
                                            <Video className="w-12 h-12 mb-2" />
                                            <p className="text-sm font-medium">Click to upload video</p>
                                            <p className="text-xs mt-1">MP4, WebM or OGG (Max 100MB)</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleVideoChange}
                                    accept="video/*"
                                    className="hidden"
                                />
                            </div>

                            {/* Post Details */}
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="description">description</Label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Write a description..."
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="pl-10 min-h-[120px] bg-gray-700 border-gray-600 text-white"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400">{formData.description.length}/500 characters</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags</Label>
                                    <Input
                                        id="tags"
                                        name="tags"
                                        placeholder="#dogs #pets #cute"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        className="bg-gray-700 border-gray-600 text-white"
                                    />
                                    <p className="text-xs text-gray-400">Separate tags with spaces</p>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500"
                                    disabled={isSubmitting || isUploading || isSuccess}
                                >
                                    {isSubmitting ? "Posting..." : "Post Video"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

