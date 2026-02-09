import PropertyCard from "./PropertyCard";

type PropertyGridProps = {
    properties: any[];
    onFavoriteClick: (property: any) => void;
    onCompareClick : (property: any) => void;
    onShareClick: (property: any) => void;
    onReschedule?: (propertyId: string) => void;
    favoriteStates: Record<string, boolean>;
    favoriteLoading: Record<string, boolean>;
};

export default function PropertyGrid({
    properties,
    onFavoriteClick,
    onCompareClick,
    onShareClick,
    onReschedule,
    favoriteStates,
    favoriteLoading,
}: PropertyGridProps) {
    return (
        <>
            <div className="sm:hidden -mx-4 px-4">
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
                    {properties.map((property) => (
                        <div key={property.id} className="snap-start shrink-0 w-[90vw] max-w-[360px]">
                            <PropertyCard
                                {...property}
                                isFavorite={!!favoriteStates[String(property.id)]}
                                isFavoriteLoading={favoriteLoading[String(property.id)]}
                                onFavoriteClick={onFavoriteClick}
                                onCompareClick={onCompareClick}
                                onShareClick={onShareClick}
                                onReschedule={onReschedule}
                            />
                        </div>
                    ))}
                </div>
            </div>

           <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
  {properties.map((property) => (
    <PropertyCard
      key={property.id}
      {...property}
      isFavorite={!!favoriteStates[String(property.id)]}
      isFavoriteLoading={favoriteLoading[String(property.id)]}
      onFavoriteClick={onFavoriteClick}
      onCompareClick={onCompareClick}
      onShareClick={onShareClick}
      onReschedule={onReschedule}
    />
  ))}
</div>

        </>
    );
}
