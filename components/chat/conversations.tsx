import { fetchAllConversations } from "@/lib/api/conversations";
import { ConversationList } from "./conversation-list";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";
import { ChatConversation } from "@/lib/types";


interface ConversationProps {
    activeConversation: ChatConversation | null
    handleSelectConversation: (converation: ChatConversation) => void
}
export default function Conversations({ activeConversation, handleSelectConversation }: ConversationProps) {
    const { data: conversations, isFetching } = useQuery({
        queryKey: ["conversations"],
        queryFn: async () => {
            const convos = await fetchAllConversations()
            if (convos && convos.length > 0) {
                handleSelectConversation(convos[0])
            }
            return convos
        },

    })
    if (isFetching) {
        return (<div className="w-full h-full flex flex-col md:w-80 border-r border-gray-800 items-center justify-center text-center">
            <div className="text-center">
                <Spinner size="md" color="blue" className="mx-auto mb-4" />
                <p className="text-gray-400">Loading conversations...</p>
            </div>
        </div>)
    }
    return (
        <div className="relative w-full h-full flex flex-col md:w-80 border-r border-gray-800 items-center" >
            {/* <SearchUser setCurrentConversation={handleSelectConversation} /> */}
        
                <div className="w-full md:w-80 border-r border-gray-800 flex-shrink-0">
                    <ConversationList
                        conversations={conversations ?? null}
                        activeConversationId={activeConversation?.id ?? null}
                        onSelectConversation={handleSelectConversation}
                    />
                </div>

            
        </div >
    )


}