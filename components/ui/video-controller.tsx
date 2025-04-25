import { ChangeEvent, MouseEvent, RefObject, TouchEvent, useEffect, useState } from "react"
import { Volume2, Volume, Volume1, VolumeX, Play, Pause } from "lucide-react"
export default function VideoController({ videoRef }: { videoRef: RefObject<HTMLVideoElement | null> }) {
    const [isMuted, setIsMuted] = useState(false)
    const [volume, setVolume] = useState(40)
    const [progress, setProgress] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    useEffect(() => {
        const videoElement = videoRef.current;
        const videoIntervalTime = setInterval(() => {
            if (videoElement) {
                setDuration(videoElement.duration)
                setIsPaused(videoElement.paused)
                if (videoElement.currentTime >= duration) {
                    clearInterval(videoIntervalTime);
                }
            }
        }, 1000)
        // Check if videoRef is not null and the video is playing
        const updateProgress = () => {
            if (videoElement) {
                setProgress(videoElement.currentTime);
            }
        }

        // Add event listener for timeupdate to update progress
        videoElement?.addEventListener("timeupdate", updateProgress);

        // Clean up the event listener when component unmounts
        return () => {
            videoElement?.removeEventListener("timeupdate", updateProgress);
        }
    }, [videoRef, duration]);

    const onClickHandler = () => {
        if (videoRef && videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play()
            } else {
                videoRef.current.pause()
            }
            setIsPaused((prev) => !prev)
        }
    }

    const onMuteHandler = (e: MouseEvent<SVGSVGElement>) => {
        e.stopPropagation()

        if (videoRef && videoRef.current) {
            if (!videoRef.current.muted) {
                setVolume(0)
            } else {
                setVolume(40)
            }
            videoRef.current.muted = !videoRef.current.muted
            setIsMuted((prev) => !prev)
        }
    }

    const onChangeVolumeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        if (videoRef && videoRef.current) {
            const volume = parseInt(e.target.value)
            setVolume(volume)
            if (volume > 0 && isMuted) {
                setIsMuted(false)
                videoRef.current.muted = false
            } else if (volume === 0 && !isMuted) {
                setIsMuted(true)
                videoRef.current.muted = true
            }
            videoRef.current.volume = volume / 100
        }
    }

    const onMouseDownHandler = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
        e.stopPropagation()
        if (videoRef.current) {
            videoRef.current.playbackRate = 2.0;
        }
    }
    const onMouseUpHandler = (e: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>) => {
        e.stopPropagation()
        if (videoRef.current) {
            videoRef.current.playbackRate = 1.0; // back to normal
        }
    }

    const onChangeProgressHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            videoRef.current.currentTime = Number(e.target.value)
        }
    }
    return (
        <div className="flex z-50 opacity-0 hover:opacity-100 flex-col items-center absolute inset-0 justify-center w-full h-full"
            onMouseDown={onMouseDownHandler}
            onMouseUp={onMouseUpHandler}
            onTouchStart={onMouseDownHandler}
            onMouseLeave={onMouseUpHandler}
            onTouchEnd={onMouseUpHandler}>
            {/* Sound Controller */}

            {/* Pause/Play video controller  */}
            <div onClick={onClickHandler} onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()} className="w-full flex items-center justify-center z-20 h-[200px]">

            </div>
            <div className="absolute top-0 left-0 px-5 py-2 w-fit flex items-center space-x-2">
                <div className="p-2 rounded-full bg-black/10 hover:bg-black/20 cursor-pointer">
                    {!isPaused ?
                        <Pause onClick={onClickHandler} className="w-8 h-8 cursor-pointer text-white" /> :
                        <Play onClick={onClickHandler} className="w-8 h-8 cursor-pointer text-white" />}
                </div>
                <div className="pr-5 py-2 w-fit">
                    <div className="rounded-full space-x-2 px-5 py-2 w-full items-center flex bg-black/10 hover:bg-black/20 cursor-pointer">
                        <div>
                            {isMuted ? (
                                <VolumeX className="w-8 h-8 " onClick={onMuteHandler} />
                            ) : (
                                volume === 0 ? <VolumeX className="w-8 h-8 " onClick={onMuteHandler} /> : volume < 33 ?
                                    <Volume className="w-8 h-8 " onClick={onMuteHandler} /> :
                                    volume >= 33 && volume < 66 ?
                                        <Volume1 className="w-8 h-8 " onClick={onMuteHandler} /> :
                                        <Volume2 className="w-8 h-8 " onClick={onMuteHandler} />
                            )}

                        </div>
                        <input type="range" onClick={e => e.stopPropagation()} min={0} max="100" value={volume} className="range range-xs" onChange={onChangeVolumeHandler} onMouseDown={(e) => e.stopPropagation()}
                            onMouseUp={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            onTouchEnd={(e) => e.stopPropagation()} />
                    </div>
                </div>

            </div>
            {/* Progress Bar */}
            <div className="w-full absolute bottom-0 p-2  pb-0 h-[50px] cursor-pointer items-end flex justify-center">
                {!isNaN(progress) &&
                    <input style={{
                        '--progress': `${(progress / duration) * 100}%`,
                    } as React.CSSProperties} type="range" onClick={e => e.stopPropagation()} step={0.1} min={0} max={duration ?? 1} value={progress} className="-mb-2 cursor-pointer custom-progress" onChange={onChangeProgressHandler} />}
            </div>
        </div>
    )
}