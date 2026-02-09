type Property = {
  id: string;
  title: string;
  owner: string;
  location: string;
  price: string;
  perSqft?: string;
  area?: string;
  status?: string;
  floor?: string;
  description?: string;
};

export default function PropertyCard({ p }: { p: Property }) {
  return (
    <div className="rounded-[18px] bg-white p-6 shadow-[0_0_10px_rgba(0,0,0,0.08)]">
      <div className="grid gap-4 sm:grid-cols-[280px_1fr_260px] items-start">
        <div className="flex items-center justify-center">
          <div className="h-56 w-full max-w-[280px] rounded-xl bg-gray-100 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="h-24 w-24 text-gray-300"
              fill="currentColor"
            >
              <path d="M21 19l-5.5-7-3.5 4.5-2.5-3L3 19z" />
            </svg>
          </div>
        </div>

        <div className="text-sm text-gray-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center justify-between w-full">
              <p className="text-gray-500">
                Owner :{" "}
                <span className="font-medium text-gray-800">{p.owner}</span>
              </p>
              <a
                className="inline-block text-gray-600 hover:underline underline"
                href="#"
              >
                Get Home Loan
              </a>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <h2 className="mt-3 text-base font-semibold text-gray-800">
              {p.title}
            </h2>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
              <div className="w-8 h-8 bg-gray-300 rounded-full" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-6 bg-gray-100 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-10 h-10 bg-gray-300 rounded-full" />
              <div>
                <p className="text-base">Super Area</p>
                <p className="font-medium text-sm">{p.area}</p>
              </div>
            </div>
            <div className="md:border-l border-gray-400 flex items-center gap-2 md:pl-2 text-gray-600">
              <div className="w-10 h-10 bg-gray-300 rounded-full" />
              <div>
                <p className="text-base">Status</p>
                <p className="font-medium text-sm">{p.status}</p>
              </div>
            </div>

            <div className="md:border-l border-gray-400 flex items-center gap-2 md:pl-2 text-gray-600">
              <div className="w-10 h-10 bg-gray-300 rounded-full" />
              <div>
                <p className="text-base">Floor</p>
                <p className="font-medium text-sm">{p.floor}</p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500">{p.description}</p>
        </div>

        <div className="flex flex-col items-end justify-between">
          <div className="text-center w-full">
            <p className="text-3xl font-semibold text-gray-800">{p.price}</p>
            <p className="text-base text-gray-500 mt-1">{p.perSqft}</p>
          </div>

          <div className="mt-4 w-full">
            <button className="mb-2 w-full rounded-full border border-gray-300 bg-white p-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Contact Owner
            </button>
            <button className="w-full rounded-full bg-[#f8f8fb] p-4 text-sm font-medium text-gray-700 border border-gray-200">
              Get Phone No.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
