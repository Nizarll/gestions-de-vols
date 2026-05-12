"use client";

import { SearchBar, SearchParams } from "./SearchBar";
import { FlightCard, Flight } from "./FlightCard";
import { Plane } from "lucide-react";

interface FlightSearchViewProps {
  flights: Flight[];
  loading: boolean;
  onSearch: (params: SearchParams) => void;
  onBook: (id: number | string) => void;
}

export function FlightSearchView({ flights, loading, onSearch, onBook }: FlightSearchViewProps) {
  return (
    <div className="space-y-6">
      <SearchBar onSearch={onSearch} />

      {loading ? (
        /* Skeleton loading state */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl animate-pulse"
              style={{
                background: "var(--sky-card)",
                border: "1px solid var(--border-subtle)",
                height: 150,
              }}
            />
          ))}
        </div>
      ) : flights.length === 0 ? (
        /* Empty state */
        <div
          className="flex flex-col items-center justify-center rounded-xl py-20"
          style={{
            background: "var(--sky-panel)",
            border: "1px dashed var(--border-default)",
          }}
          role="status"
          aria-live="polite"
        >
          <div
            className="flex items-center justify-center rounded-full mb-4"
            style={{
              width: 56,
              height: 56,
              background: "var(--sky-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            <Plane size={22} style={{ color: "var(--text-muted)", transform: "rotate(-45deg)" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Aucun vol trouvé
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
            Modifiez vos critères de recherche
          </p>
        </div>
      ) : (
        <>
          {/* Result count */}
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
                {flights.length}
              </span>{" "}
              {flights.length === 1 ? "vol disponible" : "vols disponibles"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {flights.map(flight => (
              <FlightCard key={flight.id} flight={flight} onBook={onBook} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
