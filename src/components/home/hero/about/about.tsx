"use client";
import { useEffect, useRef, useState } from "react";
import { IoPause, IoPlay } from "react-icons/io5";

const VolumeIcon = ({ muted }: { muted: boolean }) => {
  if (muted) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M1.33398 6.63998V9.35998C1.33398 10.72 2.01398 11.4 3.37398 11.4H4.34732C4.60065 11.4 4.85398 11.4733 5.06732 11.6066L7.05398 12.8466C8.77398 13.92 10.174 13.14 10.174 11.1133V4.87998C10.174 2.85331 8.76732 2.07331 7.05398 3.14664L5.06732 4.39331C4.84732 4.52665 4.60065 4.59998 4.34732 4.59998H3.37398C2.01398 4.59998 1.33398 5.27998 1.33398 6.63998Z"
          stroke="#292D32"
          strokeWidth="1.5"
        />
        <path
          d="M12 8H14.6667"
          stroke="#292D32"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M1.33398 6.63998V9.35998C1.33398 10.72 2.01398 11.4 3.37398 11.4H4.34732C4.60065 11.4 4.85398 11.4733 5.06732 11.6066L7.05398 12.8466C8.77398 13.92 10.174 13.14 10.174 11.1133V4.87998C10.174 2.85331 8.76732 2.07331 7.05398 3.14664L5.06732 4.39331C4.84732 4.52665 4.60065 4.59998 4.34732 4.59998H3.37398C2.01398 4.59998 1.33398 5.27998 1.33398 6.63998Z"
        stroke="#292D32"
        strokeWidth="1.5"
      />
    </svg>
  );
};

const FullscreenIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M1.33398 6.00004V4.33337C1.33398 2.67337 2.67398 1.33337 4.33398 1.33337H6.00065"
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 1.33337H11.6667C13.3267 1.33337 14.6667 2.67337 14.6667 4.33337V6.00004"
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.666 10.6666V11.6666C14.666 13.3266 13.326 14.6666 11.666 14.6666H10.666"
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.00065 14.6667H4.33398C2.67398 14.6667 1.33398 13.3267 1.33398 11.6667V10"
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function AboutSection() {
  const points = [
    {
      title: "Explore & Shortlist",
      desc: "Explore and shortlist properties easily using our search, map view, and virtual site visits.",
    },
    {
      title: "Show interest. No commitment yet.",
      desc: "Once you shortlist a few projects, simply show interest. We add you to a buyer group — nothing is final at this stage.",
    },
    {
      title: "Buyers come together",
      desc: "You join a private buyer group on our platform to stay informed, share views, and move forward together.",
    },
    {
      title: "Unlock better pricing options",
      desc: "When buyers come together, better pricing becomes possible — helping you save much more than individual buying.",
    },
    {
      title: "You decide. No pressure.",
      desc: "Once the group deal is ready, you complete your purchase with confidence — knowing you’re getting the best value available.",
    },
  ];

  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setVideoLoading(false);
      setVideoError(false);
      sendCommand("mute");
      sendCommand("playVideo");
    }, 1200);

    return () => clearTimeout(t);
  }, []);

  return (
    <section id="about" className="relative w-full bg-[#F2F5F9] overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="dotPattern"
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="4" cy="4" r="3" fill="#f0f0f0" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotPattern)" />
      </svg>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="max-w-[640px] order-2 lg:order-1 pl-4 lg:pl-8 xl:pl-24">
            <h3 className="text-[24px] md:text-[30px] font-semibold text-[#000] mb-6 md:mb-8">
              How
              <span className="relative inline-block pe-2">
                <span className="text-[#1C4692] ms-2"> Milke Khareedo</span>
                <svg
                  className="absolute left-0 -bottom-2"
                  width="228"
                  height="11"
                  viewBox="0 0 228 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8.5C60 1.5 170 5.5 226 8.5"
                    stroke="#1C4692"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
              Makes Buying Easier
            </h3>

            <div className="space-y-3">
              {points.map((item, i) => (
                <div key={i} className="flex gap-3 md:gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1C4692] text-white font-bold text-sm">
                    {i + 1}
                  </div>

                  <div>
                    <h5 className="text-[16px] md:text-[18px] font-semibold text-black">
                      {item.title}
                    </h5>
                    <p className="text-[13px] md:text-[12.5px] text-[#373737] mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex order-1 lg:order-2 xl:pl-20">
            <div
              ref={containerRef}
              className="relative w-full max-w-[360px] h-[500px] md:h-[520px] rounded-3xl overflow-hidden shadow-xl"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              {videoLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-3xl z-10" />
              )}

              <iframe
                ref={iframeRef}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoading ? "opacity-0" : "opacity-100"
                  }`}
                src="https://www.youtube.com/embed/k_GvGvt4Id0?enablejsapi=1&controls=0&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=k_GvGvt4Id0"
                title="Milke Khareedo"
                allow="autoplay; fullscreen"
              />

              {videoError && !videoLoading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-gray-100 rounded-3xl">
                  <div className="text-center p-4">
                    <p className="text-sm text-gray-500">Video unavailable</p>
                  </div>
                </div>
              )}

              <div
                className={`absolute inset-0 mt-113 ms-4 flex justify-start z-30 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"
                  }`}
              >
                <button
                  onClick={() => {
                    if (isPlaying) sendCommand("pauseVideo");
                    else sendCommand("playVideo");
                    setIsPlaying(!isPlaying);
                  }}
                  className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
                >
                  {isPlaying ? <IoPause size={20} /> : <IoPlay size={20} />}
                </button>
              </div>

              <div className="absolute top-[16px] left-[16px] z-20 flex items-center gap-2 text-xs md:text-sm font-semibold text-white">
                <span className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M11.6927 5.54001C12.5985 5.54001 13.3327 4.80576 13.3327 3.90001C13.3327 2.99426 12.5985 2.26001 11.6927 2.26001C10.787 2.26001 10.0527 2.99426 10.0527 3.90001C10.0527 4.80576 10.787 5.54001 11.6927 5.54001Z"
                      stroke="#353535"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.30602 5.54001C5.21177 5.54001 5.94601 4.80576 5.94601 3.90001C5.94601 2.99426 5.21177 2.26001 4.30602 2.26001C3.40027 2.26001 2.66602 2.99426 2.66602 3.90001C2.66602 4.80576 3.40027 5.54001 4.30602 5.54001Z"
                      stroke="#353535"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M11.6927 13.74C12.5985 13.74 13.3327 13.0057 13.3327 12.1C13.3327 11.1942 12.5985 10.46 11.6927 10.46C10.787 10.46 10.0527 11.1942 10.0527 12.1C10.0527 13.0057 10.787 13.74 11.6927 13.74Z"
                      stroke="#292D32"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.30602 13.74C5.21177 13.74 5.94601 13.0057 5.94601 12.1C5.94601 11.1942 5.21177 10.46 4.30602 10.46C3.40027 10.46 2.66602 11.1942 2.66602 12.1C2.66602 13.0057 3.40027 13.74 4.30602 13.74Z"
                      stroke="#292D32"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span className="leading-none text-white font-semibold">
                  Milke Khareedo
                </span>
              </div>

              <div className="absolute top-[16px] right-[16px] z-40 flex gap-2">
                <button
                  onClick={() => {
                    const nextMuted = !muted;
                    if (nextMuted) sendCommand("mute");
                    else sendCommand("unMute");
                    setMuted(nextMuted);
                  }}
                  className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow"
                >
                  <VolumeIcon muted={muted} />
                </button>

                <button
                  onClick={() => {
                    if (!containerRef.current) return;
                    if (!document.fullscreenElement) {
                      containerRef.current.requestFullscreen().catch(() => { });
                    } else {
                      document.exitFullscreen().catch(() => { });
                    }
                  }}
                  className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow"
                >
                  <FullscreenIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
