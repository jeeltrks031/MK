export default function PriceMarker({
  price,
  active,
  onClick,
}: {
  price: number;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        px-3 py-1 rounded-full text-sm font-semibold cursor-pointer
        shadow-lg transition-all w-fit
        ${
          active
            ? "bg-orange-500 text-white scale-110"
            : "bg-white text-black hover:scale-105"
        }
      `}
    >
      ₹{price} Cr
    </div>
  );
}
