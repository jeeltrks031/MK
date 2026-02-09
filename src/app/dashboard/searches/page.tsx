"use client";

import { Clock, MapPin } from "lucide-react";
import { useApi } from "@/lib/api/hooks/useApi";
import { userDashboardService } from "@/lib/api/services/userDashboard.service";
import type {
  SearchHistoryGroup,
  SearchHistoryItem,
} from "@/lib/api/services/userDashboard.service";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Loader from "@/components/ui/loader";

export default function MySearchesPage() {
  const { data, loading } = useApi<SearchHistoryGroup[]>(() =>
    userDashboardService.getSearchHistory()
  );

  const PAGE_SIZE = 10;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const groups = data ?? [];

  const flatSearches = useMemo(() => {
    return groups.flatMap((group) =>
      group.searches.map((item) => ({
        ...item,
        dateLabel: group.dateLabel,
      }))
    );
  }, [groups]);

  const visibleSearches = useMemo(
    () => flatSearches.slice(0, visibleCount),
    [flatSearches, visibleCount]
  );

  const groupedVisible = useMemo(() => {
    return visibleSearches.reduce<Record<string, SearchHistoryItem[]>>(
      (acc, item) => {
        acc[item.dateLabel] = acc[item.dateLabel] || [];
        acc[item.dateLabel].push(item);
        return acc;
      },
      {}
    );
  }, [visibleSearches]);

  const hasMore = visibleCount < flatSearches.length;

  if (loading) {
    return (
      <div className="rounded-[24px] bg-white px-6 py-10 shadow">
        <Loader size={38}/>
      </div>
    );
  }

  if (!groups.length) {
    return (
      <div className="rounded-[24px] bg-white px-6 py-10 shadow">
        No searches yet
      </div>
    );
  }

  return (
    <div className="rounded-[24px] bg-white px-4 py-6 shadow sm:px-8 sm:py-8 min-h-[480px]">
      <div className="rounded-2xl bg-[#F3F6FF] p-4 min-h-[410px]">
        <div className="flex flex-col gap-6">
          {Object.entries(groupedVisible).map(([dateLabel, searches]) => (
            <div key={dateLabel}>
              <h3 className="mb-3 text-sm font-semibold text-[#2b2b2b]">
                {dateLabel}
              </h3>

              <div className="flex flex-col gap-3">
                {searches.map((item) => (
                  <SearchRow key={item._id} item={item} />
                ))}
              </div>
            </div>
          ))}

          {hasMore && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                className="
                  rounded-full
                  border
                  border-[#1C4692]
                  px-6
                  py-2
                  text-sm
                  font-medium
                  text-[#1C4692]
                  transition
                  hover:bg-[#1C4692]
                  hover:text-white
                "
              >
                Load more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchRow({ item }: { item: SearchHistoryItem }) {
  const router = useRouter();

  const handleClick = () => {
    const params = new URLSearchParams();

    if (item.location) {
      params.set("city", item.location);
    }

    if (item.searchQuery) {
      params.set("search", item.searchQuery);
    }

    router.push(`/search-results?${params.toString()}`);
  };

  return (
    <div
      onClick={handleClick}
      className="
        flex cursor-pointer items-center justify-between gap-3
        rounded-xl bg-white px-4 py-3 shadow-sm
        transition
      "
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f4fa]">
          <Clock className="h-4 w-4 text-[#555]" />
        </span>

        <p className="min-w-0 flex-1 text-sm text-[#2b2b2b] line-clamp-2">
          {item.searchQuery}
        </p>
      </div>

      {item.location && (
        <span
          onClick={(e) => e.stopPropagation()}
          className="
            hidden sm:flex shrink-0 items-center gap-1
            rounded-full bg-[#f1f4fa]
            px-3 py-1 text-xs font-medium text-[#555]
          "
        >
          <MapPin className="h-3.5 w-3.5" />
          {item.location}
        </span>
      )}
    </div>
  );
}
