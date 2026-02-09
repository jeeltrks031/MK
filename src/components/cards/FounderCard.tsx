import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import Heading from "@/components/typography/heading";
import React from "react";
import DefaultUser from "@/assets/about-us/default-user.png";

export interface SocialLink {
  icon: React.ComponentType;
  link: string;
}

export interface FounderProps {
  name: string;
  role: string;
  desc: string;
  image?: string | StaticImageData;
  social?: SocialLink[];
}

interface FounderCardProps {
  founder: FounderProps;
  imagePriority?: boolean;
}

export default function FounderCard({
  founder,
  imagePriority,
}: FounderCardProps) {
  return (
    <div className="flex items-stretch rounded-2xl bg-white p-4 shadow-[0_18px_40px_rgba(0,0,0,0.05)] gap-[30px]">
      <div className="relative shrink-0">
        <Image
          src={founder.image || DefaultUser}
          alt={`${founder.name} image`}
          width={168}
          height={216}
          priority={imagePriority}
          className="rounded-[13px] object-cover h-full"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="space-y-2.5">
          <Heading variant={"h4"} className="text-black">
            {founder.name}
          </Heading>
          <p className="text-[18px] font-normal text-[#373737]">
            {founder.role}
          </p>
          <p className="text-base font-normal text-heading-secondary-muted-text leading-8">
            {founder.desc}
          </p>
        </div>

        {founder.social && founder.social.length > 0 && (
          <div className="mt-4 flex gap-2">
            {founder.social.map((social, index) => {
              const Icon = social.icon;
              return (
                <Link
                  key={index}
                  href={social.link}
                  target="_blank"
                  className="flex h-[55px] w-[55px] items-center justify-center rounded-full bg-[#f0eff7] transition-colors hover:bg-[#e2e0ed]"
                >
                  <Icon />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
