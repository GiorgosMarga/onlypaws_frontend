import { Skeleton } from "@/components/ui/skeleton"

export function ChatSkeleton() {
    return (
        <div className="flex h-screen max-h-screen overflow-hidden">
            {/* Conversation list skeleton */}
            <div className="w-80 border-r border-gray-800 flex-shrink-0">
                <div className="p-4 border-b border-gray-800">
                    <Skeleton className="h-7 w-32 mb-4" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div className="divide-y divide-gray-800">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-3 w-10" />
                                    </div>
                                    <Skeleton className="h-3 w-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Conversation skeleton */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-800 flex items-center">
                    <div className="flex items-center flex-1">
                        <Skeleton className="h-10 w-10 rounded-full mr-3" />
                        <div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {Array.from({ length: 3 }).map((_, groupIndex) => (
                        <div key={groupIndex} className="space-y-3">
                            <div className="flex justify-center">
                                <Skeleton className="h-5 w-20 rounded-full" />
                            </div>
                            {Array.from({ length: 3 }).map((_, messageIndex) => (
                                <div key={messageIndex} className={`flex ${messageIndex % 2 === 0 ? "justify-start" : "justify-end"}`}>
                                    <div className="flex items-end gap-2 max-w-[75%]">
                                        {messageIndex % 2 === 0 && messageIndex === 0 && <Skeleton className="h-7 w-7 rounded-full mb-1" />}
                                        {messageIndex % 2 === 0 && messageIndex !== 0 && <div className="w-7" />}
                                        <Skeleton className={`h-10 ${messageIndex % 2 === 0 ? "w-48" : "w-64"} rounded-2xl`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Message input */}
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-10 flex-1 rounded-md" />
                        <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}
