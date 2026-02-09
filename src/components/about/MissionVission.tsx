import Image from "next/image";
import Heading from "@/components/typography/heading";

export default function MissionVision() {
  return (
    <section>
      <div className="max-w-6xl mx-auto flex flex-col gap-6 md:flex-row md:gap-7 px-4">
        {/* MISSION CARD */}
        <div className="flex-1 p-6 md:p-10 bg-white rounded-4xl shadow-[0px_0px_50px_0px_rgba(0,0,0,0.10)] flex flex-col gap-7">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-[18px] overflow-hidden">
            <Image
              src="/images/LightGradient.svg"
              alt="LightGradient"
              width={80}
              height={80}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
            <Image
              src="/images/co5.png"
              alt="Mission"
              width={40}
              height={40}
              className="relative z-10 object-contain"
            />
          </div>
          <div className="flex flex-col gap-3.5">
            <Heading
              className="text-black font-semibold text-[24px]"
              variant="h3"
            >
              Mission
            </Heading>
            <p className="text-[#373737] text-[16px] font-medium leading-7 md:leading-8">
              To simplify property buying by bringing buyers together so they
              pay less, save more money, and get better pricing than buying
              alone — without confusion or pressure.
            </p>
          </div>
        </div>

        {/* VISION CARD */}
        <div className="flex-1 p-6 md:p-10 bg-white rounded-4xl shadow-[0px_0px_50px_0px_rgba(0,0,0,0.10)] flex flex-col gap-7">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-[18px] overflow-hidden">
            <Image
              src="/images/LightGradient.svg"
              alt="LightGradient"
              width={80}
              height={80}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
            <Image
              src="/images/co6.png"
              alt="Mission"
              width={40}
              height={40}
              className="relative z-10 object-contain"
            />
          </div>
          <div className="flex flex-col gap-3.5">
            <Heading
              className="text-black font-semibold text-[24px]"
              variant="h3"
            >
              Vision
            </Heading>
            <p className="text-[#373737] text-[16px] font-medium leading-7 md:leading-8">
              To help millions of Indians buy property at better prices by
              bringing buyers together and shifting power back to them.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
