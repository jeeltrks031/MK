"use client";

import { IoChevronBack, IoChevronForward } from "react-icons/io5";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="mt-8 flex justify-center items-center gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="h-9 w-9 flex items-center justify-center rounded-full border disabled:opacity-40"
      >
        <IoChevronBack />
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;
        const active = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-9 w-9 rounded-full text-sm font-semibold ${
              active
                ? "bg-[#1C4692] text-white"
                : "border hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="h-9 w-9 flex items-center justify-center rounded-full border disabled:opacity-40"
      >
        <IoChevronForward />
      </button>
    </div>
  );
}
