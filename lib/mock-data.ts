import type { User, Video } from "./types"

export const mockUsers: User[] = [
  {
    id: "user1",
    username: "dancequeen",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user2",
    username: "travelguy",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user3",
    username: "foodlover",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user4",
    username: "fitnessguru",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user5",
    username: "comedyking",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
]

export const mockVideos: Video[] = [
  {
    id: "video1",
    user: mockUsers[0],
    description: "Check out this new dance trend! #dance #viral",
    soundName: "Original Sound - dancequeen",
    coverUrl: "/placeholder.svg?height=800&width=450",
    likes: 45600,
    comments: 1200,
    shares: 3400,
  },
  {
    id: "video2",
    user: mockUsers[1],
    description: "Beautiful sunset in Bali 🌅 #travel #bali #sunset",
    soundName: "Chill Vibes - Music Artist",
    coverUrl: "/placeholder.svg?height=800&width=450",
    likes: 89700,
    comments: 3400,
    shares: 5600,
  },
  {
    id: "video3",
    user: mockUsers[2],
    description: "How to make the perfect pasta carbonara 🍝 #food #recipe #cooking",
    soundName: "Cooking Time - foodlover",
    coverUrl: "/placeholder.svg?height=800&width=450",
    likes: 34500,
    comments: 890,
    shares: 1200,
  },
  {
    id: "video4",
    user: mockUsers[3],
    description: "5-minute ab workout you can do at home! 💪 #fitness #workout #abs",
    soundName: "Workout Mix - Fitness Tracks",
    coverUrl: "/placeholder.svg?height=800&width=450",
    likes: 67800,
    comments: 2300,
    shares: 4500,
  },
  {
    id: "video5",
    user: mockUsers[4],
    description: "When your mom asks if you've cleaned your room 😂 #comedy #funny #relatable",
    soundName: "Funny Sound - comedyking",
    coverUrl: "/placeholder.svg?height=800&width=450",
    likes: 123400,
    comments: 5600,
    shares: 9800,
  },
]

