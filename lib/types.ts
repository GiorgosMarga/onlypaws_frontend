export type Post = {
    id: string
    userId: string
    tags: string[]
    description: string
    mediaUrl: string[]
    likes: number
    createdAt: string
    updatedAt: string
    thumbnail: string
    comments: number
    views: number
}

export type UserInfo = {
    userId: string
    name: string
    dogAge: number
    userAvatar: string
    dogAvatar: string
    dogBreed: string
    dogName: string
    isVerified: boolean
    bio: string
    followers: number
    following: number
}
export type ReqError = {
    message: string
}

export type Video = {
    id: string
    name: string
    dogName: string
    userAvatar?: string
    dogAvatar?: string
    description: string
    // soundName: string
    // coverUrl: string
    createdAt: string
    updatedAt: string
    likes: number
    comments: number
    views: number
    tags: string[]
    mediaUrl: string[]
    userId:string
    // thumbnail: string
    isLiked: boolean
    isSaved: boolean
}

export type Comment = {
    id: string
    content: string
    username: string
    createdAt: string
    likes: number
    userId: string
    parentId: string | null
    replies: Comment[]
    mainCommentId: string | null    
    replyToUsername: string | null
}