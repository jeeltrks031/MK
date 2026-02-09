"use client";

import Title from "../typography/title";
import Image from "next/image";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";

const founders = [
  {
    name: "Kirath Singh",
    role: "Founder & CEO",
    desc: "description description description",
    items: ["twitter", "facebook", "linkedin", "instagram"],
    avatar: "/images/f1.jpg",
  },
  {
    name: "Gundapu Anush",
    role: "Co-Founder & CMO",
    desc: "description description description",
    items: ["twitter", "facebook", "linkedin", "instagram"],
    avatar: "/images/photo2.jpeg",
  },
];

export default function Founders() {
  const renderIcon = (name: string) => {
    switch (name) {
      case "twitter":
        return <FaTwitter size={20} className="text-[#1C4692]" />;
      case "facebook":
        return <FaFacebookF size={20} className="text-[#1C4692]" />;
      case "linkedin":
        return <FaLinkedinIn size={20} className="text-[#1C4692]" />;
      case "instagram":
        return <FaInstagram size={20} className="text-[#1C4692]" />;
      default:
        return null;
    }
  };

  return (
    <section className="w-full bg-white py-16 relative overflow-hidden md:px-6 px-0">
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="rhombusPattern"
            width="2"
            height="2"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect x="0" y="0" width="1.8" height="1.8" fill="#e6e3e3ff" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#rhombusPattern)" />
      </svg>

      <div className="max-w-6xl mx-auto px-2 relative z-10">
        <Title
          text={"Team"}
          isDrawLine
          drawLineText={"Founders"}
          className="text-center mb-12 md:mb-20"
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {founders.map((founder, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row md:items-stretch rounded-2xl bg-white p-6 md:p-8 shadow-[0_18px_40px_rgba(0,0,0,0.05)]"
            >
              {/* Image */}
              <div className="mb-4 md:mb-0 md:mr-4 relative h-80 md:h-50 w-full md:w-44 shrink-0 rounded-xl overflow-hidden bg-[#f5f3ff]">
                <Image
                  src={founder.avatar}
                  alt={founder.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between text-left">
                <div>
                  <p className="font-bold text-[20px] md:text-[22px] text-[#000] leading-8">
                    {founder.name}
                  </p>

                  <p className="text-[14px] font-medium text-[#373737] leading-7">
                    {founder.role}
                  </p>

                  <p className="text-[16px] md:text-[18px] font-normal text-[#9795B5] leading-7 md:leading-8 md:pe-6">
                    {founder.desc}
                  </p>
                </div>

                {/* Social Icons */}
                <div className="mt-4 flex md:justify-start gap-3.5">
                  {founder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8FBFF] transition cursor-pointer"
                    >
                      {renderIcon(item)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
