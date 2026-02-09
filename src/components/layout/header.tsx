"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Logo from "@/assets/logo.svg";
import Image from "next/image";
import { useAuthContext } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { IoPerson, IoChevronDown } from "react-icons/io5";
import { HiOutlineMenu } from "react-icons/hi";
import { LucideCircleUserRound } from "lucide-react";
import CompareOverlay from "../home/compare/CompareOverlay";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Properties", href: "/properties" },
  { label: "Blogs", href: "/blogs" },
  { label: "About Us", href: "/about" },
    { label: "NRI ", href: "/nri" },
  { label: "Contact Us", href: "/contact" },
];

const profileMenuItems: {
  key: MenuIconKey;
  label: string;
  href: string;
}[] = [
    {
      key: "properties",
      label: "My Properties",
      href: "/dashboard/viewed-properties",
    },
    {
      key: "favorite",
      label: "My Favorite",
      href: "/dashboard/favorites",
    },
    {
      key: "visits",
      label: "Site visits",
      href: "/dashboard/site-visits",
    },
    {
      key: "compare",
      label: "Compare",
      href: "/compare",
    },
    {
      key: "searches",
      label: "My Searches",
      href: "/dashboard/searches",
    },
    {
      key: "preference",
      label: "My Preference",
      href: "/dashboard/preferences",
    },
  ];

const menuIcons = {
  properties: "/images/properties.svg",
  favorite: "/images/fav.svg",
  visits: "/images/siteVisit.svg",
  compare: "/images/convert.svg",
  searches: "/images/mySearch.svg",
  preference: "/images/myPreference.svg",
} as const;

type MenuIconKey = keyof typeof menuIcons;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isDashboard = pathname?.startsWith("/dashboard");
  const { isAuthenticated, user, logout } = useAuthContext();
  const [open, setOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname?.startsWith(href);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleOpenCompare = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setShowCompare(true);
  };

  const handleCloseCompare = () => {
    closeTimerRef.current = setTimeout(() => {
      setShowCompare(false);
    }, 200);
  };

  return (
    <header className="w-full bg-white relative z-55 overflow-x-clip shadow-[0px_9px_15px_0px_#0000000D]">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-0">
        <div className="flex items-center justify-between py-4 lg:py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={Logo}
              alt="MILKE KHEREEDO logo"
              width={216}
              height={52}
              className="
                h-10 w-auto      
                sm:h-11           
                lg:h-[52px]"            
                />
          </Link>

          {/* Navigation Links */}
          {!isDashboard && (
            <nav className="hidden items-center gap-8 text-gray-600 lg:flex xl:gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative pb-1 text-sm font-normal transition-colors xl:text-base ${isActive(link.href)
                    ? "font-semibold text-[#1C4692]"
                    : "hover:text-[#1C4692]"
                    }`}>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Side Icons */}
          <div className="flex items-center gap-3">
            {!isDashboard && (
              <div className="relative">
                <button
                  type="button"
                  aria-label="Compare"
                  onMouseEnter={handleOpenCompare}
                  onMouseLeave={handleCloseCompare}
                  onClick={() => setShowCompare((v) => !v)}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F3F6FF] hover:bg-gray-100 transition"
                >
                  <Image
                    src="/images/convertshape.svg"
                    alt="Compare"
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                </button>
                {showCompare && (
                  <div
                    className="absolute right-0 top-14 z-50 md:fixed md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 md:right-auto lg:absolute lg:right-0 lg:left-auto lg:translate-x-0 lg:translate-y-0 lg:top-14"
                    onMouseEnter={handleOpenCompare}
                    onMouseLeave={handleCloseCompare}
                  >
                    <CompareOverlay />
                  </div>
                )}
              </div>
            )}

            {/* Profile / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#1C4692] text-white"
                  aria-label="Profile menu"
                >
                  {user?.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt={user.name || "Profile"}
                      width={44}
                      height={44}
                      unoptimized
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <LucideCircleUserRound className="h-5 w-5" />
                  )}
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
                    <IoChevronDown className="h-3 w-3 text-gray-700" />
                  </span>
                </button>

                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-14 z-[200] w-[280px] rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
                      {/* Profile Header */}
                      <div className="flex items-center gap-3 px-4 py-4 border-b border-[#E3E3E3]">
                        <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                          {user?.profileImage ? (
                            <Image
                              src={user.profileImage}
                              alt={user.name || "Profile"}
                              width={40}
                              height={40}
                              unoptimized
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <LucideCircleUserRound className="h-full w-full p-2 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-[16px] font-bold text-[#141414]">
                            {user?.name || "User"}
                          </p>
                          <p className="text-[12px] font-medium text-[#828282]">
                            {user?.countryCode} {user?.phoneNumber}
                          </p>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="px-3 py-2 space-y-2">
                        {profileMenuItems.map((item) => {
                          return (
                            <Link
                              key={item.label}
                              href={item.href}
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-semibold text-[#141414] bg-[#F8FBFF] transition">
                              {/* Icon container */}
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white ">
                                <Image
                                  src={menuIcons[item.key]}
                                  alt={item.label}
                                  width={20}
                                  height={20}
                                />
                              </div>
                              {item.label}
                            </Link>
                          );
                        })}
                      </div>

                      {/* Logout */}
                      <div className="px-3 pb-4">
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                            router.push("/");
                          }}
                          className="w-full rounded-[10px] bg-[#F00004] py-2.5 text-[14px] font-medium text-[#FFFFFF] shadow-[0px_0px_16px_0px_#B3C0E752]">
                          Log out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              !isDashboard && (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="rounded-full bg-[#1C4692] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1c4692e6] lg:px-7.5 lg:py-2.5 lg:text-base">
                  Sign In
                </button>
              )
            )}

          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </header>
  );
}
