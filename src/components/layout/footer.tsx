"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/assets/footer-logo.svg";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

export default function FooterSection() {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();

  return (
    <footer className="w-full bg-[#F5F5F5] px-10">
      <div className="mx-auto max-w-[1300px] py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-y-10 lg:gap-12">
          {/* Left Column - Company Info */}
          <div className="lg:col-span-4">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Image
                src={Logo}
                alt="MILKE KHAREEDO logo"
                width={200}
                height={50}
                className="
    w-32      
    sm:w-40
    md:w-48
    lg:w-52
    h-auto
  "
                priority
              />

            </Link>
            <p className="mb-6 text-sm leading-relaxed text-[#241F20] lg:text-base">
              Buying property shouldn't feel confusing or lonely. We help buyers
              come together, understand pricing clearly, and make confident
              decisions — without pressure.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1C4692] transition-colors hover:bg-gray-200"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1C4692] transition-colors hover:bg-gray-200"
                aria-label="Facebook"
              >
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1C4692] transition-colors hover:bg-gray-200"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1C4692] transition-colors hover:bg-gray-200"
                aria-label="Instagram"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Right Columns - Navigation Links */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {/* Explore Column */}
            <div>
              <h3 className="mb-4 text-base font-bold text-[#241F20] tracking-wide lg:text-lg">
                Explore
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/properties"
                    className="text-sm text-[#241F20] transition-colors  lg:text-base"
                  >
                    Properties
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blogs"
                    className="text-sm text-[#241F20] transition-colors  lg:text-base"
                  >
                    Our Approach
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#how-it-works"
                    className="text-sm text-[#241F20] transition-colors  lg:text-base"
                  >
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blogs"
                    className="text-sm text-[#241F20] transition-colors  lg:text-base"
                  >
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blogs"
                    className="text-sm text-[#241F20] transition-colors  lg:text-base"
                  >
                    Articles
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Buyers Column */}
            <div>
              <h3 className="mb-4 text-base font-bold text-[#241F20] tracking-wide lg:text-lg">
                For Buyers
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-[#241F20] transition-colors  lg:text-base"
                  >
                    First-Time Buyers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-[#241F20] transition-colors  lg:text-base pe-20"
                  >
                    About Milke Khareedo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-[#241F20] transition-colors  lg:text-base"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faqs"
                    className="text-sm text-[#241F20] transition-colors  lg:text-base"
                  >
                    FAQ's
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nri"
                    className="text-sm text-[#241F20] transition-colors  lg:text-base"
                  >
                    NRI Support
                  </Link>
                </li>

              </ul>
            </div>

            {/* Company Column */}
            {/* <div>
              <h3 className="mb-4 text-base font-bold text-[#241F20] tracking-wide lg:text-lg">
                Company
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-[#241F20] transition-colors  lg:text-base pe-20"
                  >
                    About Milke Khareedo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/our-approach"
                    className="text-sm text-[#241F20] transition-colors  lg:text-base"
                  >
                    Our Approach
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-sm text-[#241F20] transition-colors  lg:text-base"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-use"
                    className="text-sm text-[#241F20] transition-colors  lg:text-base"
                  >
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-sm text-[#241F20] transition-colors  lg:text-base"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
