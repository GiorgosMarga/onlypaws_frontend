import { cn } from "@/lib/utils"

interface SpinnerProps {
    size?: "sm" | "md" | "lg"
    color?: "blue" | "white" | "gray"
    className?: string
}

export function Spinner({ size = "md", color = "blue", className }: SpinnerProps) {
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-8 h-8 border-3",
        lg: "w-12 h-12 border-4",
    }

    const colorClasses = {
        blue: "border-blue-500 border-t-transparent",
        white: "border-white border-t-transparent",
        gray: "border-gray-500 border-t-transparent",
    }

    return <div className={cn("animate-spin rounded-full", sizeClasses[size], colorClasses[color], className)} />
}
