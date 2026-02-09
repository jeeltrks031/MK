export default function Loader({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center py-6">
      <div
        className="animate-spin rounded-full border-2 border-gray-200 border-t-[#2F3A8F]"
        style={{ width: size, height: size }}
      />
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
  );
}

export function PDPSkeleton() {
  return (
    <>
      {/* Gallery */}
      <Skeleton className="h-[320px] w-full" />

      {/* Header */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-1/4" />
      </div>

      {/* Tabs */}
      <div className="flex gap-3 px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>

      {/* Main layout */}
      <div className="container mx-auto py-6 flex flex-col gap-6 lg:flex-row lg:gap-5">
        <div className="flex-1 space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[150px] w-full" />
        </div>

        <div className="w-full lg:w-80 space-y-4">
          <Skeleton className="h-[180px] w-full" />
          <Skeleton className="h-[120px] w-full" />
        </div>
      </div>
    </>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="rounded-xl border bg-white p-3 space-y-3">
      <Skeleton className="h-[180px] w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function PDPDetailSkeleton() {
  return (
    <>
      <Skeleton className="h-[320px] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-1/4" />
      </div>
      <div className="flex gap-3 px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="container mx-auto py-6 flex flex-col gap-6 lg:flex-row lg:gap-5">
        <div className="flex-1 space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[150px] w-full" />
        </div>
        <div className="w-full lg:w-80 space-y-4">
          <Skeleton className="h-[180px] w-full" />
          <Skeleton className="h-[120px] w-full" />
        </div>
      </div>
      <div className="space-y-6 px-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    </>
  );
}