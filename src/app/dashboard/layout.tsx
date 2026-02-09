import DashboardTabs from "./DashboardTabs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative bg-[#f5f6fa] pb-12 min-h-[86vh]">
      <div className="relative z-0 bg-[#17171D] pt-8 pb-54 md:pt-10 md:pb-48">
        <div className="mx-auto max-w-[1380px] px-4 sm:px-6">
          <h1 className="mb-6 text-[22px] sm:text-[26px] font-bold text-white">
            Dashboard
          </h1>
          <DashboardTabs />
        </div>
      </div>

      <div className="relative z-10 -mt-48 md:-mt-40 mx-auto max-w-[1380px] px-4 sm:px-6 pb-12">
        {children}
      </div>
    </section>
  );
}
