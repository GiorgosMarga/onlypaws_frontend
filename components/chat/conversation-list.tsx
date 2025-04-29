"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Search, Plus, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChatUser, type ChatConversation } from "@/lib/types"
import { fetchUsersByUsername } from "@/lib/api/user"
import ProfileAvatar from "../ui/profile-avatar"

interface ConversationListProps {
    conversations: ChatConversation[] | null
    activeConversationId: string | null
    onSelectConversation: (conversation: ChatConversation) => void
}

export function ConversationList({ conversations, activeConversationId, onSelectConversation }: ConversationListProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [users, setUsers] = useState<ChatUser[]>([])

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length === 0) return
            const data = await fetchUsersByUsername(searchQuery)
            if (data) {
                setUsers(data)
            } else {
                setUsers([])
            }
        }, 500)
        return () => clearTimeout(timer)
    }, [searchQuery])



    const onSelectNewConversationFromSearch = (userToSend: ChatUser) => {
        onSelectConversation({
            id: `${5}-${userToSend.id}`,
            user: userToSend,
            lastMessage: "",
            lastMessageTime: "",
            unreadCount: 0,
            isRead: false,
            messages: []

        } as ChatConversation)
        setUsers([])
    }

    // Filter conversations based on search query
    const filteredConversations = conversations?.filter((conversation) =>
        conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-800">
                <h2 className="text-xl font-bold mb-4">Messages</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search conversations"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-gray-800 border-gray-700 text-white"
                    />
                </div>
            </div>
            {
                users.length > 0 &&
                <ul className="menu  w-full rounded-box bg-gray-800 shadow-sm mt-2 p-3">
                    {
                        users.map((u: ChatUser) =>
                        (<li onClick={() => onSelectNewConversationFromSearch(u)} key={u.id} className="text-white hover:bg-gray-900/50 cursor-pointer items-center w-full flex flex-row p-2 rounded-xl">
                            <div className="w-10 h-10 rounded-full items-center justify-center relative overflow-hidden flex">
                                <Image
                                    src={u.userAvatar || "/placeholder.png"}
                                    alt={u.name}
                                    width={250}
                                    height={250}
                                    className="object-cover absolute w-full h-full" />
                            </div>
                            <p className="w-fit h-fit">@{u.name}</p>
                        </li>)
                        )
                    }
                </ul>
            }

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto">
                {filteredConversations && filteredConversations.length > 0 ? (
                    <div className="divide-y divide-gray-800">
                        {filteredConversations?.map((conv) => (
                            <button
                                key={conv.id}
                                className={cn(
                                    "w-full text-left p-4 hover:bg-gray-800 transition-colors",
                                    activeConversationId === conv.id && "bg-gray-800",
                                )}
                                onClick={() => onSelectConversation(conv)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <ProfileAvatar dogAvatar={conv.user.dogAvatar} userAvatar={conv.user.userAvatar} containerStyle="w-8 h-8 md:w-10 md:h-10" dogAvatarStyle="-ml-5" />
                                        {conv.user.isOnline && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-medium truncate">@{conv.user.name}</h3>
                                            <span className="text-xs text-gray-400 flex-shrink-0">{conv.lastMessageTime}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
                                            {conv.unreadCount > 0 && (
                                                <span className="ml-auto flex-shrink-0 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                            {conv.isRead && <Check className="ml-auto flex-shrink-0 h-4 w-4 text-blue-500" />}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-40">
                        <p className="text-gray-400">No conversations found</p>
                    </div>
                )}
            </div>

            {/* New message button */}
            <div className="p-4 border-t border-gray-800">
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    <Plus className="h-4 w-4 mr-2" />
                    New Message
                </Button>
            </div>
        </div>
    )
}
