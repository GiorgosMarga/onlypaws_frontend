"use client"

import { useState, useEffect } from "react"
import { Conversation } from "@/components/chat/conversation"
import Conversations from "./conversations"
import { ChatConversation } from "@/lib/types"
import { useUserStore } from "@/store/user"

export function ChatInterface() {
    const { userId } = useUserStore()
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [activeConversation, setActiveConversation] = useState<ChatConversation | null>(null)

    // Set the first conversation as active by default after loading
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:4000");
        setSocket(ws)
        return () => {
            ws.close()
            setSocket(null)
        }
    }, [])

    useEffect(() => {
        if (!socket) return

        const handleOpen = () => {
            console.log("WebSocket connected")
            socket.send(JSON.stringify({
                type: "join",
                from: userId
            }))
        }

        // Attach handler
        socket.addEventListener("open", handleOpen)

        return () => {
            // Clean up handler
            socket.removeEventListener("open", handleOpen)
        }
    }, [socket, userId])
    // Handle conversation selection
    const handleSelectConversation = (conv: ChatConversation) => {
        setActiveConversation(conv)
    }



    return (
        <div className="flex h-screen max-h-screen overflow-hidden">
            <Conversations activeConversation={activeConversation} handleSelectConversation={handleSelectConversation} />
            <div className="flex-1">
                {activeConversation ? (
                    <Conversation conversation={activeConversation} socket={socket} />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center p-8">
                            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-blue-400"
                                >
                                    <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                                    <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium mb-2">No Conversation Selected</h3>
                            <p className="text-gray-400 max-w-md">Select a conversation from the list to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
