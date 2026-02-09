"use client";

import { useEffect, useRef, useState } from "react";
import { useApi } from "@/lib/api/hooks/useApi";
import { userDashboardService } from "@/lib/api/services/userDashboard.service";
import type {
  PreferencesApi,
  SavePreferencesPayload,
} from "@/lib/api/services/userDashboard.service";
import { X } from "lucide-react";

type PreferredLocation = {
  name: string;
  latitude: number;
  longitude: number;
};

const BUDGET_MAP: Record<string, { min: number | null; max: number | null }> = {
  "50 L - 1 Cr": { min: 50, max: 100 },
  "1 Cr - 3 Cr": { min: 100, max: 300 },
  "3 Cr - 5 Cr": { min: 300, max: 500 },
  "5 Cr - 10 Cr": { min: 500, max: 1000 },
  "10 Cr - 15 Cr": { min: 1000, max: 1500 },
  "15 Cr - 20 Cr": { min: 1500, max: 2000 },
  "20 Cr - 25 Cr": { min: 2000, max: 2500 },
  "25 Cr - 30 Cr": { min: 2500, max: 3000 },
  "30 Cr +": { min: 3000, max: null },
};

const FLOOR_MAP: Record<string, { min: number; max: number | null }> = {
  "0 - 5 Floor": { min: 0, max: 5 },
  "6 - 10 Floor": { min: 6, max: 10 },
  "11 - 15 Floor": { min: 11, max: 15 },
  "16 - 20 Floor": { min: 16, max: 20 },
  "21 - 30 Floor": { min: 21, max: 30 },
  "31 - 40 Floor": { min: 31, max: 40 },
  "41 - 50 Floor": { min: 41, max: 50 },
  "51 - 60+ Floor": { min: 51, max: null },
};

const budgets = Object.keys(BUDGET_MAP);
const floors = Object.keys(FLOOR_MAP);

export default function MyPreferencePage() {
  const [localities, setLocalities] = useState<PreferredLocation[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [localityInput, setLocalityInput] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { data } = useApi<PreferencesApi>(() =>
    userDashboardService.getPreferences()
  );

  useEffect(() => {
    if ((window as any).google) return;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places`;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!(window as any).google || !inputRef.current) return;

    const autocomplete = new (window as any).google.maps.places.Autocomplete(
      inputRef.current,
      { types: ["geocode"] }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place?.geometry?.location) return;

      const cityName = extractCity(place);

      const location: PreferredLocation = {
        name: cityName,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      };

      setLocalities((prev) =>
        prev.some((l) => l.name === location.name) ? prev : [...prev, location]
      );

      setLocalityInput("");
    });
  }, []);

  useEffect(() => {
    if (!data) return;

    setLocalities(data.preferredLocations ?? []);

    setSelectedBudget(
      deriveSingleSelection(BUDGET_MAP, data.budgetMin, data.budgetMax)
    );

    setSelectedFloor(
      deriveSingleSelection(FLOOR_MAP, data.floorMin, data.floorMax)
    );
  }, [data]);

  const handleSave = async () => {
    const budget = selectedBudget
      ? BUDGET_MAP[selectedBudget]
      : { min: null, max: null };

    const floor = selectedFloor
      ? FLOOR_MAP[selectedFloor]
      : { min: null, max: null };

    const payload: SavePreferencesPayload = {
      preferredLocations: localities,
      budgetMin: budget.min,
      budgetMax: budget.max,
      floorMin: floor.min,
      floorMax: floor.max,
    };

    await userDashboardService.savePreferences(payload);
  };

  return (
    <div className="rounded-[24px] bg-white px-4 py-4 shadow">
      <h2 className="mb-4 text-lg font-bold">My Preferences</h2>

      <PreferenceCard
        localities={localities}
        setLocalities={setLocalities}
        localityInput={localityInput}
        setLocalityInput={setLocalityInput}
        inputRef={inputRef}
        budgets={budgets}
        floors={floors}
        selectedBudget={selectedBudget}
        selectedFloor={selectedFloor}
        setSelectedBudget={setSelectedBudget}
        setSelectedFloor={setSelectedFloor}
        onSave={handleSave}
      />
    </div>
  );
}

type PreferenceCardProps = {
  localities: PreferredLocation[];
  setLocalities: React.Dispatch<React.SetStateAction<PreferredLocation[]>>;
  localityInput: string;
  setLocalityInput: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  budgets: string[];
  floors: string[];
  selectedBudget: string | null;
  selectedFloor: string | null;
  setSelectedBudget: (v: string) => void;
  setSelectedFloor: (v: string) => void;
  onSave: () => void;
};

function extractCity(place: google.maps.places.PlaceResult): string {
  const city =
    place.address_components?.find((c) => c.types.includes("locality")) ||
    place.address_components?.find((c) =>
      c.types.includes("administrative_area_level_2")
    );

  return city?.long_name || place.name || "";
}

function PreferenceCard(props: PreferenceCardProps) {
  const {
    localities,
    setLocalities,
    localityInput,
    setLocalityInput,
    inputRef,
    budgets,
    floors,
    selectedBudget,
    selectedFloor,
    setSelectedBudget,
    setSelectedFloor,
    onSave,
  } = props;

  return (
    <div className="rounded-[24px] bg-[#F3F6FF] p-6 space-y-6">
      <div>
        <label className="block mb-2 text-sm font-semibold">Localities</label>
        <input
          ref={inputRef}
          value={localityInput}
          onChange={(e) => setLocalityInput(e.target.value)}
          placeholder="Search Localities"
          className="h-11 w-full rounded-lg border border-black px-4 text-sm"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {localities.map((l, i) => (
            <span
              key={i}
              className="bg-white px-3 py-1 rounded shadow text-xs flex items-center max-w-[220px]"
            >
              <span className="truncate">{l.name}</span>
              <button
                onClick={() =>
                  setLocalities(localities.filter((_, idx) => idx !== i))
                }
                className="
    ml-2 flex h-4 w-4 items-center justify-center
    rounded-full text-gray-400
    hover:bg-gray-200 hover:text-gray-700
    transition
  "
                aria-label="Remove locality"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-[#E6ECF5]" />

      <SingleSelectSection
        title="Budget"
        items={budgets}
        selected={selectedBudget}
        onSelect={setSelectedBudget}
      />

      <div className="h-px w-full bg-[#E6ECF5]" />
      <SingleSelectSection
        title="Floor Preference"
        items={floors}
        selected={selectedFloor}
        onSelect={(v) => setSelectedFloor(v)}
      />

      <button
        onClick={onSave}
        className="rounded-full bg-[#1C4692] px-6 py-2 text-sm font-semibold text-white"
      >
        Save Preferences
      </button>
    </div>
  );
}

function deriveSingleSelection<
  T extends Record<string, { min: number | null; max: number | null }>,
>(map: T, min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;

  return (
    Object.entries(map).find(([_, r]) => {
      return r.min === min && r.max === max;
    })?.[0] ?? null
  );
}

function ordinal(n: number) {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  if (n % 10 === 1) return `${n}st`;
  if (n % 10 === 2) return `${n}nd`;
  if (n % 10 === 3) return `${n}rd`;
  return `${n}th`;
}

function SingleSelectSection({
  title,
  items,
  selected,
  onSelect,
}: {
  title: string;
  items: string[];
  selected: string | null;
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold">{title}</p>

      <div className="flex flex-wrap gap-2">
        {items.map((i) => {
          let label = i;

          if (title === "Floor Preference") {
            const match = i.match(/(\d+)\s*-\s*(\d+|\d+\+)/);
            if (match) {
              const from = Number(match[1]);
              const to = match[2].includes("+")
                ? `${ordinal(Number(match[2].replace("+", "")))}+`
                : ordinal(Number(match[2]));

              label = `${ordinal(from)} – ${to} Floor`;
            }
          }

          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`rounded-full px-4 py-2 text-xs transition
                ${
                  selected === i
                    ? "bg-[#1C4692] text-white"
                    : "bg-white text-[#2b2b2b]"
                }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
