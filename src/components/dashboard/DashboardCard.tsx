export default function DashboardCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-white p-8 shadow-md ${className}`}>
      {children}
    </div>
  );
}
