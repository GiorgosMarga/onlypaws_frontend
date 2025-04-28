"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { MoreHorizontal, Phone, Video, Smile, Paperclip, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { ChatConversation, ChatMessage } from "@/lib/types"

interface ConversationProps {
    conversation: ChatConversation
    onBack?: () => void
    socket: WebSocket | null
}

export function Conversation({ conversation, socket }: ConversationProps) {
    const [newMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages)
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    // const isMobile = useIsMobile()

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()

        if (!newMessage.trim()) return

        setIsSending(true)

        // Simulate sending a message

        const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            text: newMessage,
            timestamp: "Just now",
            isFromMe: true,
            isRead: false,
        }

        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log(newMessage)
            socket.send(JSON.stringify(newMsg))
        }

        setMessages([...messages, newMsg])
        setNewMessage("")
        setIsSending(false)

        // Simulate received message after a delay
    }

    // Generate a random reply

    // Group messages by date
    const groupedMessages: { date: string; messages: ChatMessage[] }[] = []
    let currentDate = ""

    messages.forEach((message) => {
        // In a real app, you would use actual dates and format them
        // For this demo, we'll use the timestamp directly
        const messageDate =
            message.timestamp.includes("ago") || message.timestamp === "Just now"
                ? "Today"
                : message.timestamp.split(" at ")[0]

        if (messageDate !== currentDate) {
            currentDate = messageDate
            groupedMessages.push({
                date: messageDate,
                messages: [message],
            })
        } else {
            groupedMessages[groupedMessages.length - 1].messages.push(message)
        }
    })

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex items-center">
                {/* {isMobile && (
                    <button onClick={onBack} className="mr-2">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                )} */}
                <div className="flex items-center flex-1">
                    <div className="relative mr-3">
                        <Image
                            src={conversation.user.avatarUrl || "/placeholder.svg"}
                            alt={conversation.user.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                        />
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
                {groupedMessages.map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-3">
                        <div className="flex justify-center">
                            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">{group.date}</span>
                        </div>
                        {group.messages.map((message, messageIndex) => (
                            <div key={message.id} className={cn("flex", message.isFromMe ? "justify-end" : "justify-start")}>
                                <div className="flex items-end gap-2 max-w-[75%]">
                                    {!message.isFromMe && messageIndex === 0 && (
                                        <Image
                                            src={conversation.user.avatarUrl || "/placeholder.svg"}
                                            alt={conversation.user.name}
                                            width={28}
                                            height={28}
                                            className="rounded-full object-cover mb-1"
                                        />
                                    )}
                                    {!message.isFromMe && messageIndex !== 0 && <div className="w-7" />}
                                    <div
                                        className={cn(
                                            "rounded-2xl px-4 py-2 max-w-full break-words",
                                            message.isFromMe
                                                ? "bg-blue-500 text-white rounded-br-none"
                                                : "bg-gray-800 text-white rounded-bl-none",
                                        )}
                                    >
                                        <p>{message.text}</p>
                                        <div className="flex items-center justify-end gap-1 mt-1">
                                            <span className="text-xs opacity-70">{message.timestamp}</span>
                                            {message.isFromMe && message.isRead && (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="h-3 w-3 opacity-70"
                                                >
                                                    <path d="M18 6 7 17l-5-5" />
                                                    <path d="m22 10-7.5 7.5L13 16" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
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
                        onChange={(e) => setNewMessage(e.target.value)}
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
