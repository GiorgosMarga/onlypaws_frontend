import { Comment } from "../types"
import { fetchWithAuth } from "./fetchWithAuth"

export const getComments = async (videoId: string) => {
    const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URI}/comments/${videoId}`, {
                credentials: "include",
            })
    if (!res.ok) {
        throw new Error("Failed to fetch comments")
    }
    const data = await res.json()
    return data.comments as Comment[]
}