import { getQueryClient } from "@/app/get-query-client"
import { SideNav } from "@/components/side-nav"
import { UserProfile } from "@/components/user-profile"
import { getUserData, getUserPosts } from "@/lib/api/profile"
import { dehydrate, HydrationBoundary, queryOptions } from "@tanstack/react-query"

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const queryClient = getQueryClient()
    queryClient.prefetchQuery(queryOptions({
        queryKey: ["user"],
        queryFn: async () => await getUserData(id)
    }))

    queryClient.prefetchQuery(queryOptions({
        queryKey: ["posts"],
        queryFn: async () => await getUserPosts(id)
    }))

    return (
        <div className="min-h-screen bg-gray-900 text-white flex">
            <SideNav />
            <HydrationBoundary state={dehydrate(queryClient)}>
                <UserProfile id={id} />
            </HydrationBoundary>
        </div >
    )
}

