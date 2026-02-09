"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const tabs = [
  { label: "User Profile", href: "/dashboard/profile", icon: "/images/user.svg" },
  { label: "Viewed Properties", href: "/dashboard/viewed-properties", icon: "/images/building.svg" },
  { label: "My Favorite", href: "/dashboard/favorites", icon: "/images/heart.svg" },
  { label: "Site Visits", href: "/dashboard/site-visits", icon: "/images/global.svg" },
  { label: "My Searches", href: "/dashboard/searches", icon: "/images/global-search.svg" },
  { label: "My Preference", href: "/dashboard/preferences", icon: "/images/pet.svg" },
];

export default function DashboardTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 sm:flex-wrap">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            prefetch
              className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-3 text-[16px] font-medium transition
                    ${active
                      ? "bg-[#1C4692] hover:bg-[#1c4692e6] text-white"
                      : "bg-white text-gray-800 hover:bg-gray-100"
                    }`}
           
          >
            <Image
              src={tab.icon}
              alt={tab.label}
              width={20}
              height={20}
              className={active ? "invert brightness-0" : ""}
            />
            <span className="whitespace-nowrap">{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
