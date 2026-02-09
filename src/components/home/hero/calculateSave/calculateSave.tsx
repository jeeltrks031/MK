"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@/lib/api/hooks/useApi";
import {
  homeService,
  type EMICalculatorResponse,
} from "@/lib/api/services/home.service";
import { HiLightBulb } from "react-icons/hi";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Partner logos data (placeholder - replace with actual data)
const partnerLogos = [
  { name: "Partner 1", logo: "/images/ins_120033.svg", score: 9.5 },
  { name: "Partner 2", logo: "/images/ins_120033 (1).svg", score: 8.7 },
  { name: "Norte", logo: "/images/ins_120033 (2).svg", score: 7.9 },
  { name: "iQ", logo: "/images/ins_120033 (3).svg", score: 8.3 },
  { name: "Partner 5", logo: "/images/ins_120033 (4).svg", score: 9.1 },
  { name: "Partner 6", logo: "/images/ins_120033 (5).svg", score: 7.5 },
  { name: "Partner 7", logo: "/images/ins_120033 (6).svg", score: 8.8 },
];


export default function CalculateSave() {
  const router = useRouter();

  const [loanAmount, setLoanAmount] = useState(10000000);
  const [rateOfInterest, setRateOfInterest] = useState(8.9);
  const [loanTenure, setLoanTenure] = useState(60);
  const [currency, setCurrency] = useState("INR");
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleIndex =
    ((activeIndex % partnerLogos.length) + partnerLogos.length) %
    partnerLogos.length;
  const ITEM_WIDTH = 44;
  const extendedLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];
  const baseOffset = partnerLogos.length * ITEM_WIDTH;

  const handleNext = () => {
    setActiveIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => prev - 1);
  };

  const [emiData, setEmiData] = useState<EMICalculatorResponse | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const loanAmountRange = { min: 10000000, max: 500000000 };
  const rateRange = { min: 7, max: 11 };
  const tenureRange = { min: 12, max: 60 };

  const loanAmountPercent =
    ((loanAmount - loanAmountRange.min) /
      (loanAmountRange.max - loanAmountRange.min)) *
    100;
  const ratePercent =
    ((rateOfInterest - rateRange.min) / (rateRange.max - rateRange.min)) * 100;
  const tenurePercent =
    ((loanTenure - tenureRange.min) / (tenureRange.max - tenureRange.min)) *
    100;

  useEffect(() => {
    const selectedRate = partnerLogos[visibleIndex]?.score;
    if (selectedRate) {
      setRateOfInterest(selectedRate);
    }
  }, [visibleIndex]);

  // Format loan amount for display
  const formatLoanAmount = (amount: number) => {
    if (amount >= 10000000) {
      return `₹ ${(amount / 10000000).toFixed(1)} Crore`;
    } else if (amount >= 100000) {
      return `₹ ${(amount / 100000).toFixed(1)} Lakh`;
    } else {
      return `₹ ${(amount / 1000).toFixed(0)}k`;
    }
  };

  // EMI calculation mutation
  const {
    mutate: calculateEMI,
    loading: calculating,
    data: emiResponseData,
  } = useMutation<
    EMICalculatorResponse,
    { loanAmount: string; rateOfInterest: number; loanTenure: number }
  >(async (params) => {
    return homeService.calculateEMI(params);
  });

  // Update emiData when API response changes
  useEffect(() => {
    if (emiResponseData) {
      setEmiData(emiResponseData);
    }
  }, [emiResponseData]);

  // Calculate EMI when values change
  const handleCalculateEMI = useCallback(async () => {
    setIsCalculating(true);
    try {
      await calculateEMI({
        loanAmount: loanAmount.toString(),
        rateOfInterest,
        loanTenure,
      });
    } catch (error) {
      console.error("Error calculating EMI:", error);
    } finally {
      setIsCalculating(false);
    }
  }, [loanAmount, rateOfInterest, loanTenure, calculateEMI]);

  // Initial calculation on mount
  useEffect(() => {
    handleCalculateEMI();
  }, []);

  // Calculate EMI when inputs change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleCalculateEMI();
    }, 300);
    return () => clearTimeout(timer);
  }, [loanAmount, rateOfInterest, loanTenure]);

  // Handle reset
  const handleReset = () => {
    setLoanAmount(36000000);
    setRateOfInterest(8.9);
    setLoanTenure(60);
    setCurrency("INR");
  };

  // Handle Get Loan button - redirect to Contact Us
  const handleGetLoan = () => {
    router.push("/contact");
  };

  const principalPercentage =
    emiData?.emiBreakdown?.principalPercentage || 80.5;

  const formatCurrencyShort = (amount?: number | string) => {
    if (!amount) return "₹ 0";

    const value =
      typeof amount === "string" ? Number(amount.replace(/,/g, "")) : amount;

    if (value >= 1e7) {
      return `₹ ${(value / 1e7).toFixed(2)} Cr`;
    }

    if (value >= 1e5) {
      return `₹ ${(value / 1e5).toFixed(2)} L`;
    }

    if (value >= 1e3) {
      return `₹ ${(value / 1e3).toFixed(1)} K`;
    }
    return `₹ ${value}`;
  };

  return (
    <section
      className="relative w-full py-16 overflow-hidden"
      style={{
        backgroundColor: "#383331",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)),url('/images/CalculatePattern.png')`,
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
        backgroundPosition: "center",
      }}
    >

      <div className="relative z-10 mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-[32px] bg-white p-2 sm:p-6 shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 p-2">            {/* ================= LEFT SIDE ================= */}
            <div className="flex flex-col gap-4">
              {/* Circular Chart and EMI Result */}
              <div className="flex flex-col md:flex-row p-4 sm:px-3 sm:py-6 rounded-[20px] md:rounded-md bg-[#EEF4FF] gap-4 items-center md:items-start text-center md:text-left">
                {/* Circular Pie Chart */}
                <div className="relative flex-shrink-0 h-48 w-48 sm:h-44 sm:w-44 md:h-48 md:w-48 mx-auto md:mx-0">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(#38BA50 0% ${principalPercentage}%, #FFA322 ${principalPercentage}% 100%)`,
                    }}
                  ></div>
                  <div className="absolute inset-[12%] flex flex-col items-center justify-center rounded-full bg-white text-center shadow-sm">
                    <p className="text-base sm:text-lg md:text-xl font-bold text-black leading-tight px-2">
                      {emiData?.monthlyEMI?.formatted || "₹ 7,47,873.00"}
                      {/* {formatCurrencyShort(emiData?.monthlyEMI?.value)} */}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 px-2">
                      Your Monthly EMI
                    </p>
                  </div>
                </div>

                {/* EMI Result Breakdown */}
                <div className="flex-1 w-full md:w-auto rounded-md md:mt-5">
                  <h3 className="mb-3 sm:mb-4 bg-[#EEF4FF] text-base sm:text-lg font-semibold text-black">
                    Calculated EMI Result
                  </h3>

                  <div className="bg-[#ffffff] py-4 px-2 rounded-md">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between px-2">
                        <p className="flex items-center text-[12px] gap-2 font-medium text-[#000000] pe-2">
                          <span className="text-[#38BA50]">●</span> Principal
                          Amount
                        </p>
                        <span className="font-semibold text-black text-[12px]">
                          {formatCurrencyShort(emiData?.principalAmount?.value)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between px-2">
                        <p className="flex items-center text-[12px] gap-2 font-medium text-[#000000] pe-8">
                          <span className="text-[#FFA322]">●</span> Total
                          Interest
                        </p>
                        <span className="font-semibold text-black text-[12px]">
                          + {formatCurrencyShort(emiData?.totalInterest?.value)}
                        </span>
                      </div>
                    </div>

                    <div className="my-2 h-px w-full max-w-[320px] sm:max-w-[380px] md:max-w-[420px] bg-gray-200" />

                    <div className="flex items-center justify-between px-1">
                      <p className="text-[14px] text-[#000000] font-semibold">
                        Total Amount
                      </p>
                      <p className="text-[14px] font-semibold text-black">
                        {formatCurrencyShort(
                          emiData?.totalAmountPayable?.value,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#EEF4FF] px-6 py-7 rounded-md max-w-[100%] md:max-w-full flex flex-col gap-5">
                <div className="relative flex items-center justify-center mb-4">
                  <button
                    onClick={handlePrev}
                    className="absolute left-0 flex h-[38px] w-[60px] items-center justify-center rounded-full text-[#000] bg-[#FFFFFF]"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  {/* Active Score */}
                  <p className="text-lg font-semibold h-[40px] w-[64px] bg-[#FFFFFF] rounded-full text-[#AA1E2E] text-center pt-1.5">
                    {partnerLogos[visibleIndex].score}%
                  </p>

                  {/* Right Arrow */}
                  <button
                    onClick={handleNext}
                    className="absolute right-0 flex h-[38px] w-[60px] items-center justify-center rounded-full text-[#000] bg-[#FFFFFF]"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>

                <div className="overflow-hidden py-2">
                  <div
                    className="flex gap-4 transition-transform duration-300 ease-in-out"
                    style={{
                      transform: `translateX(-${baseOffset + visibleIndex * ITEM_WIDTH
                        }px)`,
                    }}
                  >
                    {extendedLogos.map((partner, idx) => {
                      const isActive =
                        idx % partnerLogos.length === visibleIndex;

                      return (
                        <div
                          key={idx}
                          className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 transition-all ${isActive
                            ? "scale-110 border-blue-400"
                            : "bg-gray-100 border-gray-200"
                            }`}
                        >
                          <img
                            src={partner.logo}
                            alt={partner.name}
                            className="h-10 w-10 object-contain"
                          />

                          {isActive && (
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-blue-500" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ================= RIGHT SIDE ================= */}
            <div className="space-y-6 sm:space-y-7">
              {/* Loan Amount Slider */}
              <div className="md:w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-6 mb-2">
                  <h4 className="font-semibold text-black text-sm sm:text-base">
                    Loan Amount
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-semibold text-black bg-[#EEF4FF] px-3 py-1 rounded">
                      <span className="text-[#1C4692]">
                        {formatLoanAmount(loanAmount)}
                      </span>{" "}
                      {currency}
                    </span>
                  </div>
                </div>

                <div className="relative mt-2">
                  <input
                    type="range"
                    min={loanAmountRange.min}
                    max={loanAmountRange.max}
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-4 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right,#1C4692 0%,#1C4692 ${loanAmountPercent}%,#E5E7EB ${loanAmountPercent}%,#E5E7EB 100%)`,
                    }}
                  />
                </div>

                <div className="mt-1 sm:mt-2 flex justify-between text-xs sm:text-sm text-gray-500">
                  {/* <span>₹ 30L</span> */}
                  <span>₹ 1Cr</span>
                  <span>₹ 10Cr</span>
                  <span>₹ 20Cr</span>
                  <span>₹ 30Cr</span>
                  <span>₹ 40Cr</span>
                  <span>₹ 50Cr</span>
                </div>
              </div>

              {/* Rate of Interest Slider */}
              <div className="md:w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-6 mb-2">
                  <h4 className="font-semibold text-black text-sm sm:text-base">
                    Rate of Interest <span className="text-[10px]">(%P.A)</span>
                  </h4>
                  <button className="bg-[#EEF4FF] text-[#1C4692] font-semibold px-3 py-1 rounded text-sm sm:text-base">
                    {rateOfInterest.toFixed(1)} %
                  </button>
                </div>

                <div className="relative mt-2">
                  <input
                    type="range"
                    min={rateRange.min}
                    max={rateRange.max}
                    step={0.1}
                    value={rateOfInterest}
                    onChange={(e) => setRateOfInterest(Number(e.target.value))}
                    className="w-full h-4 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #1C4692 0%, #1C4692 ${ratePercent}%, #E5E7EB ${ratePercent}%, #E5E7EB 100%)`,
                    }}
                  />
                </div>

                <div className="mt-1 sm:mt-2 flex justify-between text-xs sm:text-sm text-gray-500">
                  <span>7%</span>
                  <span>8%</span>
                  <span>9%</span>
                  <span>10%</span>
                  <span>11%</span>
                </div>
              </div>

              {/* Loan Tenure Slider */}
              <div className="md:w-full">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-6 mb-2">
                  <h4 className="font-semibold text-black text-sm sm:text-base">
                    Loan Tenure
                  </h4>
                  <button className="bg-[#EEF4FF] text-black font-medium px-3 py-1 rounded text-sm sm:text-base">
                    <span className="text-[#1C4692]">{loanTenure} </span>Months
                  </button>
                </div>

                <div className="relative mt-2">
                  <input
                    type="range"
                    min={tenureRange.min}
                    max={tenureRange.max}
                    step={6}
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                    className="w-full h-4 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #1C4692 0%, #1C4692 ${tenurePercent}%, #E5E7EB ${tenurePercent}%, #E5E7EB 100%)`,
                    }}
                  />
                </div>

                <div className="mt-1 sm:mt-2 flex justify-between text-xs sm:text-sm text-gray-500">
                  <span>12m</span>
                  <span>24m</span>
                  <span>36m</span>
                  <span>48m</span>
                  <span>60m</span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <HiLightBulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p>
                  {emiData?.disclaimer ||
                    "Calculated EMI result is indicative only."}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-row items-center justify-center gap-3 sm:gap-4">
                <button
                  onClick={handleReset}
                  className="w-[150px] sm:w-1/2 rounded-full border-2 border-[#F3F3F3] bg-[#F3F3F3] px-6 py-3 text-[16px] font-bold text-black"
                >
                  Reset
                </button>

                <button
                  onClick={handleGetLoan}
                  disabled={isCalculating || calculating}
                  className="w-[150px] sm:w-1/2 rounded-full bg-[#1C4692] hover:bg-[#1c4692e6] px-6 py-3 text-[16px] font-bold text-white  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Get a Loan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}
