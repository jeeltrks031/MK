import Image from "next/image";

export default function EmptySearchState() {
    return (
           <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* SVG */}
      <div className="mb-6 flex items-center justify-center">
        <Image
          src="/images/search.svg"
          alt="No results"
          width={260}
          height={260}
          priority
        />
      </div>

      <h3 className="text-xl font-semibold text-[#1C4692] mb-2">
        No matching properties yet.
      </h3>

      <p className="text-[#555555] max-w-md">
        Try adjusting your filters or explore nearby locations
      </p>
    </div>
  );
}
