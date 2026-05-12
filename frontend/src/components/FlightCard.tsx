"use client";

import { Plane, Clock } from "lucide-react";

export interface Flight {
  id: number | string;
  departure_airport: string;
  arrival_airport: string;
  flight_number: string;
  departure_time: string;
  company?: { company_name: string };
}

interface FlightCardProps {
  flight: Flight;
  onBook: (id: number | string) => void;
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "—";
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export function FlightCard({ flight, onBook }: FlightCardProps) {
  return (
    /* Boarding-pass outer frame */
    <article
      className="rounded-xl overflow-hidden flex flex-col transition-all duration-200"
      style={{
        background: "var(--sky-card)",
        border: "1px solid var(--border-default)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-sky-glow)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(59,139,235,0.18)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.25)";
      }}
    >
      {/* Top strip — route */}
      <div
        className="px-4 pt-4 pb-3"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        {/* Company + flight number */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}
          >
            {flight.company?.company_name ?? "Compagnie"}
          </span>
          <span
            className="font-mono text-xs px-2 py-0.5 rounded"
            style={{
              background: "var(--sky-lift)",
              color: "var(--accent-sky)",
              border: "1px solid var(--accent-sky-glow)",
            }}
          >
            {flight.flight_number}
          </span>
        </div>

        {/* Route display — signature boarding-pass style */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-center min-w-0">
            <div
              className="text-2xl font-bold font-mono tracking-wider"
              style={{ color: "var(--text-primary)" }}
            >
              {flight.departure_airport}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "var(--text-tertiary)" }}
            >
              {formatTime(flight.departure_time)}
            </div>
          </div>

          {/* Flight path indicator */}
          <div className="flex-1 flex items-center gap-1 min-w-0 px-1">
            <div
              className="h-px flex-1"
              style={{ background: "var(--border-default)" }}
            />
            <Plane
              size={14}
              style={{ color: "var(--accent-sky)", flexShrink: 0, transform: "rotate(0deg)" }}
              aria-hidden="true"
            />
            <div
              className="h-px flex-1"
              style={{ background: "var(--border-default)" }}
            />
          </div>

          <div className="text-center min-w-0">
            <div
              className="text-2xl font-bold font-mono tracking-wider"
              style={{ color: "var(--text-primary)" }}
            >
              {flight.arrival_airport}
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "var(--text-tertiary)" }}
            >
              Arrivée
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip — date + CTA — boarding-pass tear-off feel */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: "rgba(11,26,46,0.4)",
        }}
      >
        <div className="flex items-center gap-1.5">
          <Clock size={12} style={{ color: "var(--text-muted)" }} aria-hidden="true" />
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {formatDate(flight.departure_time)}
          </span>
        </div>

        <div className="flex gap-2">
          {/* DETAILS */}
          <button
            onClick={() => navigate(`/view/${flight.id}`)}
            className="text-xs font-semibold rounded-lg px-3 py-1.5 transition-all"
            style={{
              background: "transparent",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--accent-sky-glow)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--border-default)";
            }}
          >
            Détails
          </button>

          {/* BOOK */}
          <button
            onClick={() => navigate(`/book/${flight.id}`)}
            className="text-xs font-semibold rounded-lg px-3 py-1.5 transition-all"
            style={{
              background: "var(--accent-sky)",
              color: "#fff",
              border: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
            aria-label={`Réserver le vol ${flight.flight_number}`}
          >
            Réserver
          </button>
        </div>
      </div>
    </article>
  );
}
