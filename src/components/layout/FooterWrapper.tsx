"use client";

import { usePathname } from "next/navigation";
import FooterSection from "./footer";
import CopyRight from "./copyRight";

export default function FooterWrapper() {
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) return null;

  return (
    <>
      <FooterSection />
      <CopyRight />
    </>
  );
}
