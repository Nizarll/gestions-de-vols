"use client";

import { useState } from "react";
import { MapPin, ArrowRight, CalendarDays, Search } from "lucide-react";

export interface SearchParams {
  departure: string;
  arrival: string;
  date: string;
}

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-xs font-semibold uppercase tracking-widest mb-1 block"
      style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}
    >
      {children}
    </span>
  );
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [date, setDate] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ departure, arrival, date });
  };

  const inputStyle: React.CSSProperties = {
    background: "var(--control-bg)",
    border: "1px solid var(--control-border)",
    color: "var(--text-primary)",
    borderRadius: "var(--radius-md)",
    width: "100%",
    padding: "10px 14px 10px 36px",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-xl p-5"
      style={{
        background: "var(--sky-panel)",
        border: "1px solid var(--border-default)",
      }}
      aria-label="Recherche de vols"
    >
      <h2
        className="text-sm font-semibold mb-4 flex items-center gap-2"
        style={{ color: "var(--text-secondary)" }}
      >
        <Search size={14} style={{ color: "var(--accent-sky)" }} />
        Rechercher un vol
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        {/* Departure */}
        <div>
          <FieldLabel>Départ</FieldLabel>
          <div className="relative">
            <MapPin
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              style={inputStyle}
              placeholder="Paris CDG"
              value={departure}
              onChange={e => setDeparture(e.target.value)}
              aria-label="Aéroport de départ"
              onFocus={e => {
                (e.target as HTMLInputElement).style.borderColor = "var(--border-focus)";
              }}
              onBlur={e => {
                (e.target as HTMLInputElement).style.borderColor = "var(--control-border)";
              }}
            />
          </div>
        </div>

        {/* Arrival */}
        <div>
          <FieldLabel>Arrivée</FieldLabel>
          <div className="relative">
            <ArrowRight
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              style={inputStyle}
              placeholder="New York JFK"
              value={arrival}
              onChange={e => setArrival(e.target.value)}
              aria-label="Aéroport d'arrivée"
              onFocus={e => {
                (e.target as HTMLInputElement).style.borderColor = "var(--border-focus)";
              }}
              onBlur={e => {
                (e.target as HTMLInputElement).style.borderColor = "var(--control-border)";
              }}
            />
          </div>
        </div>

        {/* Date + Search button */}
        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <FieldLabel>Date</FieldLabel>
            <div className="relative">
              <CalendarDays
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="date"
                style={{ ...inputStyle }}
                value={date}
                onChange={e => setDate(e.target.value)}
                aria-label="Date du vol"
                onFocus={e => {
                  (e.target as HTMLInputElement).style.borderColor = "var(--border-focus)";
                }}
                onBlur={e => {
                  (e.target as HTMLInputElement).style.borderColor = "var(--control-border)";
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition-all"
            style={{
              background: "var(--accent-sky)",
              color: "#fff",
              height: 40,
              border: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              boxShadow: "0 0 16px var(--accent-sky-glow)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
          >
            <Search size={14} />
            Rechercher
          </button>
        </div>
      </div>
    </form>
  );
}
