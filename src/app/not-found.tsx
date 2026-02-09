// import Link from "next/link";

// export default function NotFound() {
//   return (
//     <section className="not-found relative w-full flex flex-col items-center justify-center py-[100px]">
//       <div className="max-w-6xl container mx-auto">
//         <div className="w-full max-w-[541px] mx-auto flex flex-col items-center justify-center">
//           <h2 className="text-black text-[70px] sm:text-[100px] md:text-[200px] font-bold leading-normal">
//             404
//           </h2>
//           <p className="text-[#555555] text-[28px] font-medium">
//             This deal doesn’t exist.
//           </p>
//           <Link
//             href="/"
//             className="bg-[#1C4692] hover:bg-[#1c4692e6] text-white rounded-[110] text-base font-semibold mt-[50px] w-full text-center py-[13px]"
//           >
//             Go Back
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

import Link from "next/link";

export default function NotFound() {
  return (
    <section className="not-found relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-3xl w-full px-6 text-center">
        <h1 className="text-black font-extrabold text-[80px] sm:text-[120px] md:text-[180px] leading-none">
          404
        </h1>

        <p className="mt-4 text-[#1C4692] text-[18px] sm:text-[28px] font-medium">
          This deal doesn’t exist.
        </p>

        <p className="mt-2 text-gray-500 text-[18px] leading-relaxed md:text-[28px]">
          But smarter property options do. Let’s <br /> get you back on track.
        </p>

        <Link
          href="/"
          className="inline-block mt-8 bg-[#1C4692] hover:bg-[#163a78] text-white font-semibold text-[16px] sm:text-base px-10 py-3 rounded-full transition-colors"
        >
          Explore properties
        </Link>
      </div>
    </section>
  );
}
