import Title from "@/components/typography/title";
import Image from "next/image";
import Heading from "@/components/typography/heading";

const items = [
  {
    id: 1,
    img: "/images/value1.jpg",
    title: "Real Savings Created",
    desc: "By bringing buyers together, we’ve helped unlock better pricing than individual buying — turning collective demand into meaningful cost savings for homebuyers.",
  },
  {
    id: 2,
    img: "/images/value2.jpg",
    title: "Better Buying Options",
    desc: "Buyers gain access to clearer comparisons, shared insights, and stronger negotiating power — leading to better project options, not rushed compromises.",
  },
  {
    id: 3,
    img: "/images/value3.jpg",
    title: "Stronger Buyer Leverage",
    desc: "When multiple buyers show interest together, builders become more flexible on pricing and benefits — creating leverage that single buyers rarely get.",
  },
  {
    id: 4,
    img: "/images/value4.jpg",
    title: "Confident Decisions",
    desc: "With transparent steps, shared context, and no pressure, buyers move forward only when they’re confident they’re getting fair value.",
  },
];

export default function ValuesAchievements() {
  return (
    <section className="relative w-full bg-[#F5F9FF] py-16 mt-[100px] overflow-hidden md:px-10 px-0">
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="squarePattern"
            width="1.8"
            height="1.8"
            patternUnits="userSpaceOnUse"
          >
            <rect x="0" y="0" width="1.5" height="1.5" fill="#e3e8efff" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#squarePattern)" />
      </svg>

      <div className="max-w-6xl mx-auto px-4 z-10 relative">
        <Title
          text={"Values"}
          drawLineText={"Achievements"}
          isDrawLine
          className="text-center mb-12 md:mb-20"
        />

        {/* Responsive Grid */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row items-start md:items-stretch rounded-3xl bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.06)] gap-5"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-2xl overflow-hidden">
                <Image
                  src={item.img}
                  alt={"achievement image"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center w-full">
                <Heading
                  variant={"h6"}
                  className="text-black font-semibold text-[16px] md:text-[18px]"
                >
                  {item.title}
                </Heading>
                <p className="mt-2 text-[14px] md:text-[15px] font-normal text-[#373737] leading-relaxed text-left">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
