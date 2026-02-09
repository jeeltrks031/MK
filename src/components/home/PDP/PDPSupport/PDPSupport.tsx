"use client";

import { homeService, type RelationshipManager } from "@/lib/api/services/home.service";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaPhoneAlt } from "react-icons/fa";
import { HiMail } from "react-icons/hi";
import Star from "@/assets/star.svg";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

interface PDPSupportProps {
  relationshipManager: RelationshipManager;
  propertyId: string;
  isBookVisit?: boolean;
  onBookVisitChange?: (isBookVisit: boolean) => void;
}

export default function PDPSupport({ 
  relationshipManager, 
  propertyId,
  isBookVisit = false,
  onBookVisitChange
}: PDPSupportProps) {
  const { checkAuth } = useAuthContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [openVisit, setOpenVisit] = useState(false);
  const [bookVisitStatus, setBookVisitStatus] = useState(isBookVisit);
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState<"date" | "time">("date");
  const [hour, setHour] = useState<number>(10);
  const [amPm, setAmPm] = useState<"AM" | "PM">("AM");
  const hours = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8];
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const jsDay = new Date(calendarYear, calendarMonth, 1).getDay();
  const firstDay = (jsDay + 6) % 7;

  // Sync bookVisitStatus with prop changes
  useEffect(() => {
    setBookVisitStatus(isBookVisit);
  }, [isBookVisit]);

  const [selectedDate, setSelectedDate] = useState<{
    day: number;
    month: number;
    year: number;
  } | null>(null);

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const handleCall = () => {
    if (relationshipManager.phone) {
      window.location.href = `tel:${relationshipManager.phone}`;
    }
  };

  const handleEmail = () => {
    if (relationshipManager.email) {
      window.location.href = `mailto:${relationshipManager.email}`;
    }
  };

  const handleConfirmVisit = async () => {
    if (!selectedDate) return;

    try {
      setIsBooking(true);
      const visitDateObj = new Date(
        selectedDate.year,
        selectedDate.month,
        selectedDate.day
      );

      const visitDate = visitDateObj.toISOString().split("T")[0];
      const visitTime = `${hour}:00 ${amPm}`;
      const response = await homeService.bookVisit({
        propertyId,
        visitDate,
        visitTime,
      });

      if (response.success && response.data) {
        // Update state immediately for smooth UI update - no page reload needed
        const newBookVisitStatus = response.data.isBookVisit;
        
        // Update local state first for instant UI feedback
        setBookVisitStatus(newBookVisitStatus);
        
        // Update parent component state
        onBookVisitChange?.(newBookVisitStatus);
        
        // Show success feedback
        setShowSuccess(true);
        
        // Close modal after showing success
        setTimeout(() => {
          setOpenVisit(false);
          setShowSuccess(false);
          // Reset form
          setSelectedDate(null);
          setStep("date");
          setHour(10);
          setAmPm("AM");
        }, 1500);
      }
    } catch (error) {
      console.error("BOOK VISIT ERROR:", error);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-white border border-[#F3F3F3] py-4 text-center md:px-6 lg:px-0">
      <div className="relative px-8">
        <p className="text-lg font-bold text-[#000000] leading-relaxed">
          Hi, I am here to Answer <br /> all your queries.
        </p>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[#000000] px-3">
          <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_1092_12078)">
              <path d="M25.4559 51.8703L31.7368 51.4774C32.093 51.4551 32.4259 51.2921 32.662 51.0244C32.8982 50.7568 33.0184 50.4062 32.9961 50.0499L32.6031 43.7691C32.5868 43.5081 32.4675 43.2643 32.2714 43.0913C32.0753 42.9183 31.8185 42.8303 31.5576 42.8466C31.2966 42.863 31.0528 42.9823 30.8798 43.1784C30.7068 43.3744 30.6188 43.6312 30.6351 43.8922L30.8909 48.1696C21.5068 39.7223 22.296 32.3848 23.6189 28.742C23.7142 28.4796 23.8181 28.2207 23.9307 27.9655C24.5149 28.8529 25.1597 29.6988 25.8606 30.4973C28.1904 33.1426 30.6961 34.6805 32.9167 34.8268C36.2923 35.0493 39.0163 33.788 40.5863 31.2767C41.3804 29.9872 41.8058 28.5047 41.8162 26.9904C41.8436 25.475 41.4648 23.9799 40.7193 22.6604C39.2515 20.0924 36.5427 18.6686 33.2872 18.7545C30.1659 18.8366 27.0081 20.5499 24.6642 23.2068C24.4258 23.4771 24.1962 23.7568 23.9755 24.0461C23.4409 22.9218 22.9988 21.7557 22.6537 20.5596C21.4742 16.452 20.626 8.74609 28.1951 3.28464C28.4032 3.13057 28.5421 2.90071 28.5819 2.64488C28.6216 2.38905 28.5589 2.12786 28.4074 1.91793C28.2559 1.708 28.0277 1.56624 27.7724 1.52338C27.5171 1.48053 27.2551 1.54003 27.0434 1.68899C25.9039 2.50366 24.859 3.44307 23.9281 4.48973C22.2887 6.33168 21.1059 8.53372 20.4754 10.9177C19.6464 14.0403 19.7454 17.5621 20.7619 21.1024C21.2478 22.7828 21.9083 24.4076 22.7326 25.9504C22.3568 26.631 22.0346 27.3399 21.7689 28.0705C20.5986 31.2936 20.5683 34.8368 21.6815 38.317C22.9369 42.2425 25.5935 46.0493 29.5786 49.6371L25.3326 49.9027C25.2034 49.9108 25.0771 49.9442 24.9608 50.0012C24.8445 50.0581 24.7406 50.1374 24.6549 50.2345C24.5693 50.3315 24.5036 50.4446 24.4616 50.567C24.4196 50.6895 24.4022 50.8191 24.4103 50.9483C24.4183 51.0775 24.4518 51.2039 24.5087 51.3202C24.5656 51.4364 24.6449 51.5404 24.742 51.626C24.8391 51.7117 24.9521 51.7774 25.0746 51.8194C25.1971 51.8613 25.3266 51.8788 25.4558 51.8707L25.4559 51.8703ZM27.3373 29.1966C26.4663 28.2016 25.6884 27.1287 25.0137 25.9914C27.0494 22.9301 30.274 20.8023 33.3392 20.7215C35.8839 20.6544 37.898 21.6896 39.011 23.6367C40.1625 25.6514 40.1249 28.3023 38.9178 30.2334C38.758 30.4895 38.5773 30.7321 38.3777 30.9587C37.159 32.3402 35.3001 33.0115 33.0463 32.863C31.373 32.7528 29.2922 31.4164 27.3375 29.1967L27.3373 29.1966Z" fill="black" />
            </g>
            <defs>
              <clipPath id="clip0_1092_12078">
                <rect width="39.7362" height="39.7362" fill="white" transform="translate(56.0859 26.2883) rotate(131.42)" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[#000000] px-3">
          <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_1092_12075)">
              <path d="M30.63 51.8703L24.3492 51.4774C23.9929 51.4551 23.6601 51.2921 23.4239 51.0244C23.1877 50.7568 23.0676 50.4062 23.0899 50.0499L23.4828 43.7691C23.4992 43.5081 23.6185 43.2643 23.8146 43.0913C24.0106 42.9183 24.2674 42.8303 24.5284 42.8466C24.7893 42.863 25.0331 42.9823 25.2061 43.1784C25.3791 43.3744 25.4671 43.6312 25.4508 43.8922L25.1951 48.1696C34.5791 39.7223 33.79 32.3848 32.4671 28.742C32.3718 28.4796 32.2678 28.2207 32.1552 27.9655C31.571 28.8529 30.9262 29.6988 30.2253 30.4973C27.8955 33.1426 25.3898 34.6805 23.1692 34.8268C19.7936 35.0493 17.0696 33.788 15.4996 31.2767C14.7056 29.9872 14.2802 28.5047 14.2697 26.9904C14.2424 25.475 14.6211 23.9799 15.3666 22.6604C16.8345 20.0924 19.5432 18.6686 22.7988 18.7545C25.9201 18.8366 29.0778 20.5499 31.4217 23.2068C31.6602 23.4771 31.8897 23.7568 32.1104 24.0461C32.645 22.9218 33.0871 21.7557 33.4322 20.5596C34.6117 16.452 35.4599 8.74609 27.8908 3.28464C27.6828 3.13057 27.5438 2.90071 27.5041 2.64488C27.4643 2.38905 27.527 2.12786 27.6785 1.91793C27.83 1.708 28.0582 1.56624 28.3135 1.52338C28.5689 1.48053 28.8308 1.54003 29.0426 1.68899C30.182 2.50366 31.2269 3.44307 32.1578 4.48973C33.7973 6.33168 34.9801 8.53372 35.6105 10.9177C36.4396 14.0403 36.3405 17.5621 35.3241 21.1024C34.8382 22.7828 34.1777 24.4076 33.3534 25.9504C33.7291 26.631 34.0513 27.3399 34.3171 28.0705C35.4873 31.2936 35.5177 34.8368 34.4045 38.317C33.149 42.2425 30.4925 46.0493 26.5074 49.6371L30.7533 49.9027C30.8825 49.9108 31.0089 49.9442 31.1252 50.0012C31.2414 50.0581 31.3454 50.1374 31.431 50.2345C31.5167 50.3315 31.5824 50.4446 31.6244 50.567C31.6663 50.6895 31.6838 50.8191 31.6757 50.9483C31.6676 51.0775 31.6341 51.2039 31.5772 51.3202C31.5203 51.4364 31.441 51.5404 31.3439 51.626C31.2468 51.7117 31.1338 51.7774 31.0113 51.8194C30.8889 51.8613 30.7593 51.8788 30.6301 51.8707L30.63 51.8703ZM28.7486 29.1966C29.6197 28.2016 30.3975 27.1287 31.0723 25.9914C29.0365 22.9301 25.8119 20.8023 22.7467 20.7215C20.202 20.6544 18.188 21.6896 17.075 23.6367C15.9235 25.6514 15.961 28.3023 17.1681 30.2334C17.328 30.4895 17.5086 30.7321 17.7082 30.9587C18.9269 32.3402 20.7858 33.0115 23.0396 32.863C24.7129 32.7528 26.7937 31.4164 28.7485 29.1967L28.7486 29.1966Z" fill="black" />
            </g>
            <defs>
              <clipPath id="clip0_1092_12075">
                <rect width="39.7362" height="39.7362" fill="white" transform="matrix(0.66157 0.749883 0.749883 -0.66157 0 26.2883)" />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>

      <div className="mt-4 px-4">
        <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm">
          <div className="relative h-48 w-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
            {/* Relationship manager image placeholder - styled to look professional */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
              {relationshipManager.name && (
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Large circular avatar */}
                  <div className="w-36 h-36 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center border-4 border-white/40 shadow-xl">
                    <span className="text-6xl font-bold text-white">
                      {relationshipManager.name.charAt(0)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 5 Star Rating Badge - positioned bottom left */}
            <div className="absolute left-2 bottom-2 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 bg-[#BDBDBD99] backdrop-blur-[24px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
              <div className="bg-white rounded-full p-[4px]">
                <Image src={Star} alt="star" width={10} height={10} />
              </div>
              <span className="text-xs font-medium text-[#ffffff]">5 Star Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 px-3">
        {/* Left – Name */}
        <div className="mt-3 text-left">
          <p className="text-lg font-semibold text-[#000000]">
            {relationshipManager.name}
          </p>
          <p className="text-[14px] text-[#000000] mt-0.5 font-normal">
            Relationship Manager
          </p>
        </div>

        {/* Right – Action Buttons */}
        <div className="ml-auto flex items-center gap-1">
          <a
            href={`tel:${relationshipManager.phone?.replace(/[^\d+]/g, "")}`}
            onClick={(e) => {
              e.stopPropagation();
              handleCall()
            }}
            className="relative z-[100] inline-flex items-center gap-1 rounded-full bg-[#66AE39] text-white px-2.5 py-2 text-xs font-medium hover:bg-[#5a9a32] transition-colors shadow-sm">
            <FaPhoneAlt className="h-3.5 w-3.5" />
            <span>Call</span>
          </a>

          <button
            onClick={handleEmail}
            className="inline-flex items-center gap-1 rounded-full text-[#000000] px-2.5 py-2 text-xs font-medium  transition-colors border border-[#F3F3F3]">
            <HiMail className="h-3.5 w-3.5" />
            <span>Email</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 mt-4">
        <button
          onClick={() => {
            if (bookVisitStatus) return;
            
            // Check authentication before opening modal
            if (!checkAuth()) {
              setShowAuthModal(true);
              return;
            }
            
            setOpenVisit(true);
            setStep("date");
          }}
          disabled={isBooking || bookVisitStatus}
          className={`w-full rounded-[110px] py-3 px-6 text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${
            bookVisitStatus
              ? "bg-white border-2 border-[#1C4692] text-[#1C4692] cursor-default"
              : "bg-[#1C4692] text-white hover:bg-[#1a3d7a]"
          }`}>
          {isBooking 
            ? "Booking..." 
            : bookVisitStatus 
              ? "Visit Booked" 
              : "Book A Visit"}
        </button>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          // After successful login, open visit modal
          setOpenVisit(true);
          setStep("date");
        }}
      />
      {openVisit && (
        <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
          <div className="w-[92%] max-w-[420px] bg-white rounded-3xl p-5 animate-scaleIn">

            <div className="flex items-center justify-between mb-6">
              <p className="text-[22px] font-bold text-black">
                Schedule Visit
              </p>
              <button
                onClick={() => setOpenVisit(false)}
                className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                ✕
              </button>
            </div>

            {/* ================= DATE STEP ================= */}
            {step === "date" && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handlePrevMonth}
                    className="h-8 w-8 rounded-full bg-gray-100 flex justify-center items-center">
                    <ArrowLeft size={16} />
                  </button>
                  <p className="text-[16px] font-semibold text-[#000000]">
                    {new Date(calendarYear, calendarMonth).toLocaleString("en-US", {
                      month: "long",
                    })}{" "}
                    {calendarYear}
                  </p>
                  <button
                    onClick={handleNextMonth}
                    className="h-8 w-8 rounded-full bg-gray-100 flex justify-center items-center">
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* WEEK DAYS HEADER */}
                <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-sm">

                  {/* Empty cells before month start */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {/* Days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const todayMidnight = new Date();
                    todayMidnight.setHours(0, 0, 0, 0);
                    const isPast = new Date(calendarYear, calendarMonth, day) < todayMidnight;
                    const isSelected = selectedDate?.day === day && selectedDate?.month === calendarMonth && selectedDate?.year === calendarYear;

                    return (
                      <button
                        key={day}
                        disabled={isPast}
                        onClick={() => {
                          setSelectedDate({
                            day,
                            month: calendarMonth,
                            year: calendarYear,
                          });
                          setStep("time");
                        }}
                        className={`h-10 w-10 rounded-lg border text-sm font-medium transition-all
                          ${isPast
                            ? "text-gray-300 cursor-not-allowed border-transparent"
                            : isSelected
                              ? "text-[#1C4692] border-[#1C4692] scale-[1.05]"
                              : "border-transparent text-gray-700 hover:border-[#1C4692] hover:text-[#1C4692]"
                          }`}>
                        {day}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* ================= SUCCESS STEP ================= */}
            {showSuccess && (
              <div className="py-8 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  Visit Booked Successfully!
                </h3>
                <p className="text-gray-600">
                  Your visit has been scheduled. We&apos;ll contact you soon to confirm.
                </p>
              </div>
            )}

            {/* ================= TIME STEP ================= */}
            {step === "time" && !showSuccess && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">
                    <span>Selected Date</span> <span className="font-bold">
                      {selectedDate?.day}{" "}
                      {new Date(
                        selectedDate!.year,
                        selectedDate!.month
                      ).toLocaleString("en-US", { month: "long" })}{" "}
                      {selectedDate?.year}
                    </span>
                  </p>

                  <button
                    onClick={() => setStep("date")}
                    className="text-[12px] bg-[#1C4692] text-white py-2 px-4 rounded-md"
                  >
                    Back
                  </button>
                </div>

                <p className="text-[16px] font-medium mb-4">Select Time</p>

                <div className="grid grid-cols-4 gap-3 mb-6">
                  {hours.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHour(h)}
                      className={`py-3 rounded-xl border text-sm font-medium transition-all
                        ${hour === h
                          ? "text-[#1C4692] border-[#1C4692] scale-[1.02]"
                          : "bg-white text-gray-700 "
                        }`}
                    >
                      {h}:00
                    </button>
                  ))}
                </div>

                <div className="flex rounded-full bg-[#F5F7FB] p-1 mb-6 gap-1">
                  {["AM", "PM"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setAmPm(v as "AM" | "PM")}
                      className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all
                      ${amPm === v
                          ? "border-2 border-[#1C4692] text-[#1C4692] bg-white shadow-sm"
                          : "border-2 border-transparent text-gray-600 hover:text-[#1C4692]"
                        }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleConfirmVisit}
                  className="w-full bg-[#1C4692] text-white py-3 rounded-xl font-semibold"
                >
                  Confirm Visit
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
