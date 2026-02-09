"use client";

import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import { authService } from "@/lib/api/services/auth.service";
import { useAuthContext } from "@/contexts/AuthContext";
import Image from "next/image";
import CountryCodeSelector from "./CountryCodeSelector";
import Link from "next/link";
import Logo from "@/assets/logo.svg";
import { createPortal } from "react-dom";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type AuthStep = "phone" | "otp";

const features = [
  {
    icon: "/images/home.png",
    text: "Buy together. Save more money",
  },
  {
    icon: "/images/home1.png",
    text: "Direct access to verified projects",
  },
  {
    icon: "/images/home2.png",
    text: "Better pricing through group demand",
  },
  {
    icon: "/images/home3.png",
    text: "Dedicated relationship manager to guide you",
  },
];

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
}: AuthModalProps) {
  const { login } = useAuthContext();
  const [step, setStep] = useState<AuthStep>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Format phone number for display
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6)
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    if (cleaned.length <= 10)
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)}`;
  };

  // Handle phone number input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError(null);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only numbers

    const newOtp = otp.split("");
    newOtp[index] = value;
    setOtp(newOtp.join("").slice(0, 6));
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, 6)
      .replace(/\D/g, "");
    if (pastedData.length > 0) {
      setOtp(pastedData);
      // Focus last input
      const lastIndex = Math.min(pastedData.length - 1, 5);
      otpInputRefs.current[lastIndex]?.focus();
    }
  };

  // Handle backspace in OTP
  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Send OTP (Login/Register)
  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authService.loginOrRegister({
        phoneNumber,
        countryCode,
      });

      if (response.success) {
        setStep("otp");
        setResendTimer(60); // Start 60 second timer
      } else {
        setError(response.message || response.error || "Failed to send OTP");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authService.verifyOTP({
        phoneNumber,
        countryCode,
        otp,
      });

      if (response.success && response.data) {
        if (!response.data.token || !response.data.user) {
          setError("Invalid response from server. Please try again.");
          return;
        }

        // Store token and user data
        login(response.data.token, response.data.user);

        await new Promise(resolve => setTimeout(resolve, 100));

        onSuccess?.();
        handleClose();
      } else {
        setError(response.message || response.error || "Invalid OTP");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    setError(null);

    try {
      const response = await authService.resendOTP({
        phoneNumber,
        countryCode,
        type: "login",
      });

      if (response.success) {
        setResendTimer(60); // Reset timer
        setOtp(""); // Clear OTP
        otpInputRefs.current[0]?.focus();
      } else {
        setError(response.message || response.error || "Failed to resend OTP");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Reset state when modal closes
  const handleClose = () => {
    setStep("phone");
    setPhoneNumber("");
    setOtp("");
    setError(null);
    setResendTimer(0);
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="
    relative w-full
    max-w-[95vw]
    sm:max-w-[540px]
    md:max-w-[760px]
    lg:max-w-[920px]
    xl:max-w-[1020px]
    max-h-[90vh]
    rounded-[24px]
    shadow-2xl
    overflow-hidden
    flex flex-col
  "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background Image */}
          <div className="absolute inset-0 ">
            <Image
              src="/images/auth.jpg"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/65" />
          </div>


          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 md:right-6 md:top-6 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#E53935] hover:bg-[#d32f2f]"
            aria-label="Close"
          >
            <IoClose className="h-4 w-4 text-white" />
          </button>


          <div className="relative z-10 flex flex-col md:grid md:grid-cols-2 h-full">
            {/* Left Side - Auth Form */}
            <div className="flex flex-col justify-center p-6 md:p-8 bg-white  m-4 md:my-6 md:ms-6 rounded-4xl">
              {/* Logo */}
              <div className="mb-4 flex items-center gap-3">

                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src={Logo}
                    alt="MILKE KHEREEDO logo"
                    width={252}
                    height={60}
                    className="h-9 w-auto sm:h-10 lg:h-[60px]"
                  />
                </Link>
              </div>

              {step === "phone" ? (
                <>
                  {/* Phone Number Screen */}
                  <h2 className="mb-2 text-[25px] font-bold text-gray-900">
                    Welcome
                  </h2>
                  <p className="mb-6 text-gray-500 text-[14px]">
                    Enter your mobile number to get started
                  </p>

                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center rounded-xl border border-gray-300 bg-white h-12">
                      <div className="px-4 text-sm font-medium text-gray-700">
                        +91
                      </div>
                      <input
                        type="text"
                        value={formatPhoneNumber(phoneNumber)}
                        onChange={handlePhoneChange}
                        placeholder="000 000 0000"
                        className="flex-1 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                      />
                    </div>

                  </div>

                  {error && (
                    <div className="mb-4 text-sm text-red-500">{error}</div>
                  )}

                  <button
                    onClick={handleSendOTP}
                    disabled={loading || phoneNumber.length !== 10}
                    className="w-full rounded-full bg-[#1C4692]  px-6 py-3 text-[12px] font-semibold text-white hover:bg-[#1c4692e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Sending..." : "CONTINUE"}
                  </button>

                  <p className="mt-6 text-[12px] text-[black] text-center mx-4">
                    By continuing, you agree to our{" "}
                    <a
                      href="/terms"
                      className="text-[#1C4692] font-bold underline"
                    >
                      Terms & Conditions
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mb-2 text-[24px] font-bold text-gray-900">
                    Enter OTP
                  </h2>

                  <p className="mb-6 text-gray-600 text-sm">
                    We’ve sent a verification code to +91 {formatPhoneNumber(phoneNumber)}
                  </p>

                  <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Verification Code <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 6) setOtp(value);
                      }}
                      placeholder="Enter OTP"
                      className="
        w-full h-12
        rounded-xl
        border border-gray-300
        px-4
        text-gray-900
        placeholder-gray-400
        focus:outline-none
        focus:border-[#1C4692]
      "
                    />
                  </div>

                  {error && (
                    <div className="mb-4 text-sm text-red-500">{error}</div>
                  )}

                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading || otp.length !== 6}
                    className="
      w-full rounded-full
      bg-[#1C4692]
      px-6 py-3
      text-sm font-semibold text-white
      hover:bg-[#1c4692e6]
      disabled:opacity-50
    "
                  >
                    {loading ? "Verifying..." : "VERIFY OTP"}
                  </button>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    Didn&apos;t receive the code?{" "}
                    {resendTimer > 0 ? (
                      <span className="text-[#747474]">
                        Resend in {resendTimer}s
                      </span>
                    ) : (
                      <button
                        onClick={handleResendOTP}
                        disabled={loading}
                        className="text-[#1C4692] font-medium hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                </>

              )}
            </div>

            {/* Right Side - Features */}
            <div className="flex flex-col justify-start px-6 pb-6 pt-6 md:pt-48 md:px-10 relative">



              <div className="relative z-10">
                <h3 className="mb-6 text-[22px] font-semibold text-white flex items-center gap-2">
                  How are we different
                  <span className="h-2 w-2  mb-5 bg-[#F97316]" />
                </h3>

                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                        <Image
                          src={feature.icon}
                          alt="feature icon"
                          width={22}
                          height={22}
                          className="object-contain"
                        />
                      </div>

                      <p className="text-white text-[16px]">{feature.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
