import Heading from "@/components/typography/heading";
import React from "react";

interface TitleProps {
  text: string;
  drawLineText?: string;
  isDrawLine?: boolean;
  className?: string;
}

const Title: React.FC<TitleProps> = ({
  text,
  drawLineText,
  isDrawLine,
  className = "",
}) => {
  return (
    <Heading variant="h2" className={className}>
      <span className="text-black">{text} </span>

      {isDrawLine && (
        <span className="text-[#1C4692] relative inline-block">
          <span className="whitespace-nowrap">{drawLineText}</span>

          {/* UNDERLINE */}
          <span className="absolute left-0 -bottom-3 w-full">
            <svg
              viewBox="0 0 231 14"
              preserveAspectRatio="none"
              className="w-full h-[14px]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 12.5C58.459 4.89071 183.802 -6.34513 229.5 9.5858"
                stroke="#1C4692"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </span>
      )}
    </Heading>
  );
};

export default Title;
