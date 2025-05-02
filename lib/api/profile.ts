
import StatusCodes from "http-status-codes"
import type { UserInfo, Post, ReqError } from "@/lib/types"
import { fetchWithAuth } from "./fetchWithAuth"

// const defaultOptions: RequestInit = {
//     method: "GET",
//     headers: {
//         "content-type": "application/json",
//     },
//     credentials: "include"
// }

export async function getUserData(userId: string): Promise<UserInfo | ReqError> {
    try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URI!}/user-info?id=${userId}`)
        const body = await response.json()
        if (response.status === StatusCodes.NOT_FOUND) {
            return { message: "User not found" }
        } 
        if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
            return { message: "Internal server error" }
        }
        return body.userInfo as UserInfo ?? null
    } catch {
        return { message: "Internal server error" }
    }
}

export async function getUserPosts(userId: string): Promise<Post[]> {
    try {
        const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URI!}/posts/user/${userId}`)
        const body = await response.json()
        return (body.posts as Post[]) ?? []
    } catch {
        return []
    }
}