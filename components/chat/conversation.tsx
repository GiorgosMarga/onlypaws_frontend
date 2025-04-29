"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { MoreHorizontal, Phone, Video, Smile, Paperclip, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { ChatConversation, ChatMessage } from "@/lib/types"
import { useUserStore } from "@/store/user"
import ProfileAvatar from "../ui/profile-avatar"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchMessages } from "@/lib/api/conversations"
import { format } from "date-fns"

interface ConversationProps {
    conversation: ChatConversation
    onBack?: () => void
    socket: WebSocket | null
}

export function Conversation({ conversation, socket }: ConversationProps) {
    const { userId } = useUserStore()
    const [newMessage, setNewMessage] = useState("")
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const queryClient = useQueryClient()
    const [isOtherUserTyping, setIsOtherUserTyping] = useState(false)
    const { data: messages } = useQuery({
        queryKey: [`message-${conversation.id}`],
        queryFn: async () => await fetchMessages(conversation.id),
    })

    const mutation = useMutation({
        mutationKey: [`message-${conversation.id}`],
        onMutate: async (newMessage: ChatMessage) => {
            const oldData = queryClient.getQueryData<ChatMessage[]>([`message-${conversation.id}`])
            if (!oldData) return

            queryClient.setQueryData([`message-${conversation.id}`], (old: ChatMessage[]) => {
                return [...old, newMessage]
            })
            return { oldData }
        }
    })

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()

        if (!newMessage.trim()) return

        setIsSending(true)


        const newMsg: ChatMessage = {
            content: newMessage,
            from: userId,
            to: conversation.user.id,
            createdAt: new Date().toDateString()
        }
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: "message",
                message: newMsg
            }))
        }
        mutation.mutate({
            ...newMsg,
            id: `${messages ? messages.length + 1 : 1}`
        })
        setNewMessage("")

        setIsSending(false)
        sendIsTypingMessage(false)

    }

    const sendIsTypingMessage = (isTyping: boolean) => {
        if (socket && socket.readyState === socket.OPEN) {
            socket.send(JSON.stringify({
                type: "typing",
                isTyping,
                from: userId,
                to: conversation.user.id
            }))
        }
    }

    // group messages by date
    const groupedMessages = messages?.reduce((acc: Record<string, ChatMessage[]>, msg) => {
        const dateKey = format(new Date(msg.createdAt), "yyyy-MM-dd");
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(msg);
        return acc;
    }, {});

    useEffect(() => {
        if (socket) {
            socket.onmessage = (e) => {
                const data = JSON.parse(e.data)
                // if (data.message.conversationId !== conversation.id) return
                if (data.type === 'message') {
                    console.log(data, "Userid:", userId)
                    // setMessages((prev) => [...prev, data.message])
                    mutation.mutate(data.message)
                } else if (data.type === "typing") {
                    setIsOtherUserTyping(data.isTyping)
                }
            }
        }
    }, [])



    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center">
                <div className="flex items-center flex-1">
                    <div className="relative mr-3">
                        <ProfileAvatar userAvatar={conversation.user.userAvatar} dogAvatar={conversation.user.dogAvatar} containerStyle="h-10 md:h-12 w-10 md:w-12" dogAvatarStyle="-ml-5" />
                        {conversation.user.isOnline && (
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-medium">{conversation.user.name}</h3>
                        <p className="text-xs text-gray-400">{conversation.user.isOnline ? "Online" : "Last seen recently"}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreHorizontal className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {groupedMessages &&
                    Object.entries(groupedMessages).map(([date, msgs]) => (
                        <div key={date} className="space-y-3">
                            <div className="text-center text-gray-400 text-sm my-2">
                                {format(new Date(date), "MMMM d, yyyy")}
                            </div>
                            {msgs.map((message, messageIndex) => (
                                <div key={message.id} className={cn("flex ", message.from === userId ? "justify-end" : "justify-start")}>
                                    <div className="flex items-end gap-2 max-w-[75%]">
                                        {message.from !== userId && messageIndex === 0 && (
                                            <Image
                                                src={conversation.user.userAvatar || "/placeholder.svg"}
                                                alt={conversation.user.name}
                                                width={28}
                                                height={28}
                                                className="rounded-full object-cover mb-1"
                                            />
                                        )}
                                        {message.from !== userId && messageIndex !== 0 && <div className="w-7" />}
                                        <div className="flex flex-col">
                                            <div
                                                className={cn(
                                                    "rounded-2xl px-4 py-2 max-w-full break-words",
                                                    message.from === userId
                                                        ? "bg-blue-500 text-white rounded-br-none"
                                                        : "bg-gray-800 text-white rounded-bl-none",
                                                )}
                                            >
                                                <p>{message.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                }
                {isOtherUserTyping && <span className="text-white/50 text-sm ml-9 -mt-5">Typing...</span>}
                <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-gray-800">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="icon" className="rounded-full">
                        <Smile className="h-5 w-5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="rounded-full">
                        <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                        value={newMessage}
                        onBlur={() => {
                            sendIsTypingMessage(false)
                        }}
                        onChange={(e) => {
                            if (socket && socket.readyState === socket.OPEN) {
                                sendIsTypingMessage(true)
                            }
                            setNewMessage(e.target.value)
                        }}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-800 border-gray-700 text-white"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isSending || !newMessage.trim()}
                        className="rounded-full bg-blue-500 hover:bg-blue-600"
                    >
                        {isSending ? <Spinner size="sm" color="white" /> : <Send className="h-5 w-5" />}
                    </Button>
                </form>
            </div>
        </div>
    )
}
