export default function IntroVideo() {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 w-[275px] h-[500px] rounded-4xl bg-[#f6f4ff] shadow-xl">
      <div className="pointer-events-auto flex h-full flex-col items-center justify-between gap-6 px-6 py-6">
        <div className="flex w-full justify-end">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-[#d4cfee]"
              fill="currentColor"
            >
              <path d="M21 19l-5.5-7-3.5 4.5-2.5-3L3 19z" />
              <circle cx="9" cy="8" r="2" />
            </svg>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl">
            <svg
              viewBox="0 0 24 24"
              className="h-24 w-24 text-[#d4cfee]"
              fill="currentColor"
            >
              <path d="M21 19l-5.5-7-3.5 4.5-2.5-3L3 19z" />
              <circle cx="9" cy="8" r="2" />
            </svg>
          </div>
          <p className="text-base font-semibold text-[#5c5b80]">Intro Video</p>
        </div>

        <div className="flex w-full justify-start">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-[#d4cfee]"
              fill="currentColor"
            >
              <path d="M21 19l-5.5-7-3.5 4.5-2.5-3L3 19z" />
              <circle cx="9" cy="8" r="2" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
