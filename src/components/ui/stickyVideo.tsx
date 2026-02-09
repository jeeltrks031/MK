"use client";

import {
  IoCloseCircleOutline,
  IoExpand,
  IoPause,
  IoPlay,
  IoVolumeHigh,
  IoVolumeMute,
} from "react-icons/io5";
import { useRef, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Skeleton } from "./loader";

export default function StickyVideo() {
  const pathname = usePathname();
  if (pathname.startsWith("/dashboard")) return null;

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  const sendCommand = (func: string) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func,
        args: [],
      }),
      "*"
    );
  };

  const togglePlayPause = () => {
    if (isPlaying) sendCommand("pauseVideo");
    else sendCommand("playVideo");
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (muted) sendCommand("unMute");
    else sendCommand("mute");
    setMuted(!muted);
  };

  const goFullScreen = () => {
    iframeRef.current?.requestFullscreen();
  };

  const closeVideo = () => {
    sendCommand("pauseVideo");
    setVisible(false);
  };

  return (
    <div className="group fixed bottom-2 right-6 z-50 w-[200px] h-[380px] rounded-3xl overflow-hidden shadow-xl hidden md:block">
      {loading && (
        <Skeleton className="absolute inset-0 z-20 rounded-3xl animate-pulse" />
      )}

      <iframe
        ref={iframeRef}
        className={`w-full h-full transition-opacity duration-500 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        src={`https://www.youtube.com/embed/k_GvGvt4Id0?enablejsapi=1&autoplay=1&mute=1&controls=0&playsinline=1&rel=0&modestbranding=1&origin=${window.location.origin}`}
        title="MilkeKhareedo"
        allow="autoplay; fullscreen"
      />

      {!loading && (
        <button
          onClick={closeVideo}
          className="absolute top-3 right-3 h-9 w-9 bg-white rounded-full flex items-center justify-center shadow-lg z-40"
        >
          <IoCloseCircleOutline size={20} />
        </button>
      )}

      {!loading && (
        <button
          onClick={togglePlayPause}
          className="absolute bottom-3 left-3 h-9 w-9 bg-white rounded-full flex items-center justify-center shadow-lg z-40"
        >
          {isPlaying ? <IoPause size={18} /> : <IoPlay size={18} />}
        </button>
      )}

      {!loading && (
        <button
          onClick={toggleMute}
          className="absolute bottom-3 left-14 h-9 w-9 bg-white rounded-full flex items-center justify-center shadow-lg z-40"
        >
          {muted ? <IoVolumeMute size={18} /> : <IoVolumeHigh size={18} />}
        </button>
      )}

      {!loading && (
        <button
          onClick={goFullScreen}
          className="absolute bottom-3 right-3 h-9 w-9 bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition z-40"
        >
          <IoExpand size={18} />
        </button>
      )}
    </div>
  );
}
