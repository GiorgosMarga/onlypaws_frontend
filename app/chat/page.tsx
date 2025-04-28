import { ChatInterface } from "@/components/chat/chat-interface"
import { SideNav } from "@/components/side-nav"

export default function ChatPage() {
    return (
        <div className="flex min-h-screen bg-gray-900 text-white">
            <SideNav />
            <div className="flex-1">
                <ChatInterface />
            </div>
        </div>
    )
}
