import React, { useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";

type ImageUploaderProps = {
    image: string | null;
    onChange: (file: File | null, preview: string) => void;
    error?: string;
    label: string
};

export default function ImageUploader({
    image,
    onChange,
    error,
    label
}: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onChange(null, "");
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 5 * 1024 * 1024) {
            alert("File size exceeds 5MB");
            return;
        }
        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image file");
            return;
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            onChange(file, e.target?.result as string)
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="flex flex-col items-center mb-6">
            <Label className="mb-2">{label}</Label>
            <div className="relative">
                <div
                    className="w-32 h-32 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={handleImageClick}
                >
                    {image ? (
                        <Image
                            src={image}
                            alt="image preview"
                            width={128}
                            height={128}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                    )}
                </div>

                {image && (
                    <button
                        type="button"
                        onClick={handleRemoveClick}
                        className="absolute top-0 right-0 bg-red-500 rounded-full p-1"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                )}

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />
            </div>
            <p className="text-xs text-gray-400 mt-2">Click to upload (max 5MB)</p>
            {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
        </div>
    );
};
