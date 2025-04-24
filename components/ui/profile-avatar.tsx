import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function ProfileAvatar({ userAvatar, dogAvatar, containerStyle, dogAvatarStyle }: { userAvatar?: string; dogAvatar?: string, containerStyle?: string, dogAvatarStyle?: string }) {
    return <div className="relative flex w-fit h-fit ">
        <div className={twMerge("w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gray-700", containerStyle)}>
            <Image
                src={userAvatar || "/placeholder.png"}
                alt={"User Avatar"}
                width={150}
                height={150}
                className="object-cover w-full h-full"
            />
        </div>
        <div className={twMerge("w-24 h-24 md:w-32 md:h-32 rounded-full -ml-10 overflow-hidden border-4 border-gray-700", containerStyle, dogAvatarStyle)}>
            <Image
                src={dogAvatar || "/placeholder.png"}
                alt={"Dog Avatar"}
                width={150}
                height={150}
                className="object-cover w-full h-full"
            />
        </div>
    </div>
}