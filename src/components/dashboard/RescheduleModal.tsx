"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { userDashboardService } from "@/lib/api/services/userDashboard.service";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
  currentVisitDate?: string;
  onSuccess?: () => void;
}

export default function RescheduleModal({
  isOpen,
  onClose,
  propertyId,
  propertyName,
  currentVisitDate,
  onSuccess,
}: RescheduleModalProps) {
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [step, setStep] = useState<"date" | "time">("date");
  const [hour, setHour] = useState<number>(10);
  const [amPm, setAmPm] = useState<"AM" | "PM">("AM");
  const [showSuccess, setShowSuccess] = useState(false);
  const hours = [9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8];
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const jsDay = new Date(calendarYear, calendarMonth, 1).getDay();
  const firstDay = (jsDay + 6) % 7;

  const [selectedDate, setSelectedDate] = useState<{
    day: number;
    month: number;
    year: number;
  } | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep("date");
      setSelectedDate(null);
      setHour(10);
      setAmPm("AM");
      setShowSuccess(false);
      setIsRescheduling(false);
    }
  }, [isOpen]);

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

  const handleConfirmReschedule = async () => {
    if (!selectedDate) return;

    try {
      setIsRescheduling(true);
      const visitDateObj = new Date(
        selectedDate.year,
        selectedDate.month,
        selectedDate.day
      );

      const visitDate = visitDateObj.toISOString().split("T")[0];
      const visitTime = `${hour}:00 ${amPm}`;
      const response = await userDashboardService.rescheduleVisit({
        propertyId,
        visitDate,
        visitTime,
      });

      if (response.success && response.data) {
        // Show success feedback
        setShowSuccess(true);
        
        // Close modal after showing success
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
          onSuccess?.();
        }, 1500);
      }
    } catch (error) {
      console.error("Error rescheduling visit:", error);
    } finally {
      setIsRescheduling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-[420px] bg-white rounded-3xl p-5 animate-scaleIn max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[22px] font-bold text-black">
            Reschedule Visit
          </p>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {propertyName}
        </p>

        {/* SUCCESS STEP */}
        {showSuccess && (
          <div className="py-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              Visit Rescheduled Successfully!
            </h3>
            <p className="text-gray-600">
              Your visit has been rescheduled. We&apos;ll contact you soon to confirm.
            </p>
          </div>
        )}

        {/* DATE STEP */}
        {step === "date" && !showSuccess && (
          <>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handlePrevMonth}
                className="h-8 w-8 rounded-full bg-gray-100 flex justify-center items-center hover:bg-gray-200 transition-colors">
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
                className="h-8 w-8 rounded-full bg-gray-100 flex justify-center items-center hover:bg-gray-200 transition-colors">
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

        {/* TIME STEP */}
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
                className="text-[12px] bg-[#1C4692] text-white py-2 px-4 rounded-md hover:bg-[#1a3d7a] transition-colors">
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
                    }`}>
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
                    }`}>
                  {v}
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirmReschedule}
              disabled={isRescheduling}
              className="w-full bg-[#1C4692] text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1a3d7a] transition-colors">
              {isRescheduling ? "Rescheduling..." : "Confirm Reschedule"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
