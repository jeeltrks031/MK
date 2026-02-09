"use client";

import Link from "next/link";

export default function CopyRight() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="w-full border-t border-white/10 bg-[#241F20] py-6 px-10">
      <div className="mx-auto container max-w-[1300px]">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-white sm:flex-row">
          <p>© Copyright {currentYear} MILKE KHAREEDO</p>
          <div className="flex items-center gap-2">
            <Link href="/terms-of-use" className="transition-colors">
              Terms of use
            </Link>
            <span>|</span>
            <Link href="/privacy-policy" className="transition-colors">
              Privacy policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
