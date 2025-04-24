import { useUserStore } from "@/store/user";
import ProfileAvatar from "./profile-avatar";
import { type Comment } from "@/lib/types";
import { ChevronDown, ChevronUp, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function CommentCard({ comment, onClickReplyHandler, isReply }: { comment: Comment, onClickReplyHandler: (comment: Comment) => void, isReply?: boolean }) {
    const { userId } = useUserStore();
    const [isExpanded, setIsExpanded] = useState(false);


    return <div className={cn("flex gap-3")}>
        <ProfileAvatar containerStyle={`bg-red-500 ${isReply ? "md:w-10 md:h-10" : "md:w-11 md:h-11"} `} dogAvatarStyle="-ml-5" />
        <div className="flex-1">
            <div className="flex items-baseline">
                <span className="font-semibold text-sm">@{comment.userId === userId ? "you" : comment.username} {isReply && comment.replyToUsername? ` > @${comment.replyToUsername}` : ""}</span>
                <span className="ml-2 text-xs text-gray-400">{new Date(comment.createdAt).getDate()}-{new Date(comment.createdAt).getMonth()}</span>
            </div>
            <p className="text-sm mt-1">{comment.content}</p>
            <div className="flex flex-col">
                <div className="flex items-center gap-4 mt-2">
                    <button
                        className="flex items-center gap-1 text-xs text-gray-400"
                    // onClick={() => handleLikeComment(comment.id)}
                    >
                        <Heart className={cn("w-3.5 h-3.5", "fill-red-500 text-red-500")} />
                        {/* <span>
                        {likedComments[comment.id] ? comment.likes + 1 : comment.likes > 0 ? comment.likes : "Like"}
                    </span> */}
                    </button>
                    <button className="text-xs text-gray-400 cursor-pointer" onClick={() => onClickReplyHandler(comment)}>Reply</button>
                </div>
                {
                    comment.replies && comment.replies.length > 0 && <button
                        className="flex items-center gap-1 cursor-pointer text-xs text-blue-400 mt-2"
                        onClick={() => setIsExpanded((prev) => !prev)}
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="w-3 h-3" />
                                <span>
                                    Hide {comment.replies!.length} {comment.replies!.length === 1 ? "reply" : "replies"}
                                </span>
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-3 h-3" />
                                <span>
                                    View {comment.replies!.length} {comment.replies!.length === 1 ? "reply" : "replies"}
                                </span>
                            </>
                        )}
                    </button>
                }
                <div className="flex flex-col gap-2 mt-2">

                    {isExpanded && comment.replies?.map((reply) => {
                        return (
                            <CommentCard
                                key={reply.id}
                                comment={reply}
                                onClickReplyHandler={onClickReplyHandler}
                                isReply
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    </div>
}