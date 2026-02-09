"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  data: {
    id: number;
    title: string;
    desciption: string;
  };
};

export default function FAQSCard({ data }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-[100%] mx-10px rounded-4xl bg-[#FFFFFF] shadow-md">
      {/* Header */}
      <div
        className="flex justify-between items-center py-6 px-8 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <p
          className="text-[#000] font-semibold text-[16px] md:text-[18px] leading-[100%]"
          style={{ fontWeight: "600" }}
        >
          {data?.title}
        </p>

        <div className="text-[#1C4692]">
          {open ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </div>

      {open && (
        <div className="px-8 pb-6">
          <p className="text-[#8C8C8C] font-medium text-[14px] md:text-[16px] leading-7">
            {data?.desciption}
          </p>
        </div>
      )}
    </div>
  );
}
