import { Skeleton } from "@/components/ui/skeleton"

export function CommentSectionSkeleton() {
    return (
        <div className="flex flex-col h-full">
            {/* Header skeleton */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-6 rounded-full" />
            </div>

            {/* Comments list skeleton */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                        <div className="flex-1">
                            <div className="flex items-baseline gap-2 mb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                            <Skeleton className="h-3 w-full mb-1" />
                            <Skeleton className="h-3 w-4/5 mb-2" />
                            <div className="flex gap-3">
                                <Skeleton className="h-3 w-12" />
                                <Skeleton className="h-3 w-12" />
                            </div>

                            {/* Responses skeleton (for some comments) */}
                            {i % 2 === 0 && (
                                <>
                                    <Skeleton className="h-3 w-24 mt-2 mb-3" />
                                    <div className="ml-8 space-y-3">
                                        {Array.from({ length: 2 }).map((_, j) => (
                                            <div key={j} className="flex gap-3">
                                                <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                                                <div className="flex-1">
                                                    <div className="flex items-baseline gap-2 mb-1">
                                                        <Skeleton className="h-3 w-20" />
                                                        <Skeleton className="h-2 w-10" />
                                                    </div>
                                                    <Skeleton className="h-2 w-full mb-1" />
                                                    <Skeleton className="h-2 w-4/5 mb-1" />
                                                    <Skeleton className="h-3 w-8" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Comment input skeleton */}
            <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                    <Skeleton className="flex-1 h-10 rounded-md" />
                    <Skeleton className="h-10 w-10 rounded-md" />
                </div>
            </div>
        </div>
    )
}