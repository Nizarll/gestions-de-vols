"use client";

import { Ticket, Plane, X } from "lucide-react";

export interface Booking {
  id: number | string;
  seat_number?: string;
  status?: string;
  flight?: {
    flight_number: string;
    departure_airport: string;
    arrival_airport: string;
    departure_time: string;
    company?: { company_name: string };
  };
}

interface BookingListViewProps {
  bookings: Booking[];
  loading: boolean;
  onCancel: (id: number | string) => void;
}

function StatusBadge({ status }: { status?: string }) {
  const s = (status ?? "confirmed").toLowerCase();
  const map: Record<string, { label: string; bg: string; color: string; border: string }> = {
    confirmed: {
      label: "Confirmé",
      bg: "rgba(16,185,129,0.1)",
      color: "#10B981",
      border: "rgba(16,185,129,0.25)",
    },
    cancelled: {
      label: "Annulé",
      bg: "rgba(239,68,68,0.1)",
      color: "#EF4444",
      border: "rgba(239,68,68,0.25)",
    },
    pending: {
      label: "En attente",
      bg: "rgba(245,158,11,0.1)",
      color: "#F59E0B",
      border: "rgba(245,158,11,0.25)",
    },
  };
  const cfg = map[s] ?? map.confirmed;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      <span
        className="inline-block rounded-full"
        style={{ width: 5, height: 5, background: cfg.color }}
        aria-hidden="true"
      />
      {cfg.label}
    </span>
  );
}

function formatDateTime(iso?: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function BookingListView({ bookings, loading, onCancel }: BookingListViewProps) {
  if (loading) {
    return (
      <div className="space-y-3" role="status" aria-busy="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl animate-pulse"
            style={{ background: "var(--sky-card)", border: "1px solid var(--border-subtle)", height: 88 }}
          />
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl py-20"
        style={{
          background: "var(--sky-panel)",
          border: "1px dashed var(--border-default)",
        }}
        role="status"
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
          <Ticket size={22} style={{ color: "var(--text-muted)" }} />
        </div>
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          Aucune réservation
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
          Recherchez un vol pour effectuer votre première réservation
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
          Mes réservations
          <span
            className="ml-2 inline-flex items-center justify-center rounded-full text-xs font-bold"
            style={{
              width: 20,
              height: 20,
              background: "var(--accent-sky-dim)",
              color: "var(--accent-sky)",
            }}
          >
            {bookings.length}
          </span>
        </h2>
      </div>

      <ul className="space-y-3" role="list">
        {bookings.map(booking => (
          <li
            key={booking.id}
            className="rounded-xl overflow-hidden transition-all duration-150"
            style={{
              background: "var(--sky-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            {/* Main row */}
            <div className="flex items-center gap-4 px-4 py-3">
              {/* Icon */}
              <div
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{
                  width: 38,
                  height: 38,
                  background: "var(--accent-sky-dim)",
                  border: "1px solid var(--accent-sky-glow)",
                }}
                aria-hidden="true"
              >
                <Plane size={16} style={{ color: "var(--accent-sky)" }} />
              </div>

              {/* Route */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="font-mono font-bold text-base tracking-wide"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {booking.flight?.departure_airport ?? "—"}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>→</span>
                  <span
                    className="font-mono font-bold text-base tracking-wide"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {booking.flight?.arrival_airport ?? "—"}
                  </span>
                  <span
                    className="font-mono text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: "var(--sky-lift)",
                      color: "var(--accent-sky)",
                      border: "1px solid var(--accent-sky-glow)",
                    }}
                  >
                    {booking.flight?.flight_number ?? "—"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {formatDateTime(booking.flight?.departure_time)}
                  </span>
                  {booking.seat_number && (
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      Siège{" "}
                      <span style={{ color: "var(--text-tertiary)", fontWeight: 600 }}>
                        {booking.seat_number}
                      </span>
                    </span>
                  )}
                  {booking.flight?.company?.company_name && (
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {booking.flight.company.company_name}
                    </span>
                  )}
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={booking.status} />
                {(booking.status ?? "confirmed").toLowerCase() !== "cancelled" && (
                  <button
                    onClick={() => onCancel(booking.id)}
                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all"
                    style={{
                      color: "var(--text-tertiary)",
                      border: "1px solid var(--border-default)",
                      background: "transparent",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.color = "#EF4444";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.3)";
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--text-tertiary)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-default)";
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }}
                    aria-label={`Annuler la réservation ${booking.id}`}
                  >
                    <X size={12} />
                    Annuler
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
