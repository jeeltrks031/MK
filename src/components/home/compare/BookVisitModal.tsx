"use client";

import { useState } from "react";
import {
  IoClose,
  IoCalendarOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoBusinessOutline,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { homeService } from "@/lib/api/services/home.service";

interface BookVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
  propertyLocation?: string;
  propertyDeveloper?: string;
}

// Generate all time slots from 9 AM to 6 PM
const TIME_SLOTS = Array.from({ length: 10 }, (_, i) => {
  const hour = 9 + i;
  return `${hour.toString().padStart(2, "0")}:00`;
});

// Format time for display (e.g., "09:00" -> "9:00 AM")
const formatTimeDisplay = (time: string) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
};

export default function BookVisitModal({
  isOpen,
  onClose,
  propertyId,
  propertyName,
  propertyLocation,
  propertyDeveloper,
}: BookVisitModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Get date 30 days from now for max date
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!selectedDate) {
      setError("Please select a visit date");
      return;
    }
    if (!selectedTime) {
      setError("Please select a visit time");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await homeService.bookVisit({
        propertyId,
        visitDate: selectedDate,
        visitTime: selectedTime,
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setError(response.message || response.error || "Failed to book visit");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book visit");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDate("");
    setSelectedTime("");
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl transform transition-all duration-200 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all hover:scale-110"
            aria-label="Close"
          >
            <IoClose className="h-6 w-6" />
          </button>

          <div className="p-6 sm:p-8 lg:p-10">
            {/* Header */}
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold text-gray-900">
                Book A Site Visit
              </h2>
              <p className="text-gray-600">
                Schedule your visit to explore this property
              </p>
            </div>

            {/* Property Details Card */}
            <div className="mb-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-6 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-2">
                <IoBusinessOutline className="h-6 w-6 text-[#1C4692]" />
                {propertyName}
              </h3>
              <div className="space-y-2">
                {propertyDeveloper && (
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <IoBusinessOutline className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Developer:</span>{" "}
                    {propertyDeveloper}
                  </p>
                )}
                {propertyLocation && (
                  <p className="text-sm text-gray-700 flex items-center gap-2">
                    <IoLocationOutline className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Location:</span>{" "}
                    {propertyLocation}
                  </p>
                )}
              </div>
            </div>

            {success ? (
              <div className="py-12 text-center">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 transform transition-all duration-300">
                  <IoCheckmarkCircle className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Visit Booked Successfully!
                </h3>
                <p className="mb-6 text-gray-600 text-lg">
                  Your visit has been scheduled for{" "}
                  <span className="font-semibold text-gray-900">
                    {new Date(selectedDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>{" "}
                  at{" "}
                  <span className="font-semibold text-gray-900">
                    {formatTimeDisplay(selectedTime)}
                  </span>
                  . We&apos;ll contact you soon to confirm.
                </p>
                <button
                  onClick={handleClose}
                  className="rounded-lg bg-[#1C4692] px-8 py-3 font-semibold text-white hover:bg-[#1c4692e6] transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Date Selection */}
                <div className="mb-8">
                  <label className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-800">
                    <IoCalendarOutline className="h-5 w-5 text-[#1C4692]" />
                    Select Visit Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={today}
                      max={maxDateStr}
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setError(null);
                      }}
                      className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-4 text-base font-medium text-gray-900 transition-all focus:border-[#1C4692] focus:outline-none focus:ring-4 focus:ring-[#1C4692]/10 hover:border-gray-400"
                    />
                    {selectedDate && (
                      <div className="mt-2 text-sm text-gray-600">
                        Selected:{" "}
                        <span className="font-semibold text-gray-900">
                          {new Date(selectedDate).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="mb-8">
                  <label className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-800">
                    <IoTimeOutline className="h-5 w-5 text-[#1C4692]" />
                    Select Visit Time <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedTime(time);
                          setError(null);
                        }}
                        className={`group relative rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                          selectedTime === time
                            ? "border-[#1C4692] bg-[#1C4692] text-white shadow-lg shadow-[#1C4692]/30 scale-105"
                            : "border-gray-300 bg-white text-gray-700 hover:border-[#1C4692] hover:bg-[#1C4692]/5 hover:shadow-md"
                        }`}
                      >
                        <span className="block">{formatTimeDisplay(time)}</span>
                        {selectedTime === time && (
                          <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white">
                            <IoCheckmarkCircle className="h-4 w-4 text-[#1C4692]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    Available slots: 9:00 AM - 6:00 PM
                  </p>
                </div>

                {error && (
                  <div className="mb-6 rounded-xl bg-red-50 border-2 border-red-200 p-4 transform transition-all duration-200">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleClose}
                    className="flex-1 rounded-xl border-2 border-gray-300 bg-white px-6 py-4 font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !selectedDate || !selectedTime}
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#1C4692] to-[#e14f20] px-6 py-4 font-bold text-white shadow-lg shadow-[#1C4692]/30 hover:shadow-xl hover:shadow-[#1C4692]/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="h-5 w-5 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Booking Visit...
                      </span>
                    ) : (
                      "Confirm Visit"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
