import DashboardCard from "@/components/dashboard/DashboardCard";

export default function DashboardHomePage() {
  return (
    <DashboardCard className="min-h-[420px] flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          Welcome to your Dashboard
        </h2>

        <p className="mt-3 text-sm md:text-base text-gray-500 leading-relaxed">
          Use the options above to manage your profile, favorites, searches, and
          preferences.
        </p>
      </div>
    </DashboardCard>
  );
}
