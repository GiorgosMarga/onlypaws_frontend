import { Skeleton } from "@/components/ui/skeleton"

export function VideoFeedSkeleton() {
    return (
        <div className="flex w-fit max-w-5xl mx-auto px-4 justify-center">
            {/* Video container skeleton */}
            <div className="relative w-auto h-[90vh] aspect-[9/16] rounded-xl overflow-hidden shadow-2xl">
                {/* Video thumbnail skeleton */}
                <Skeleton className="absolute inset-0" />

                {/* User info skeleton */}
                <div className="absolute bottom-0 left-0 p-4 w-full z-10">
                    <div className="flex items-end justify-between">
                        <div className="w-4/5">
                            <div className="flex items-center gap-2 mb-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-3 w-full mb-2" />
                            <Skeleton className="h-3 w-3/4 mb-4" />
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>

                        {/* Action buttons skeleton */}
                    </div>
                </div>
            </div>
        </div>
    )
}
