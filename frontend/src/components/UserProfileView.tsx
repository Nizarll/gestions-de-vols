"use client";

import { User, Mail, Ticket, Plane } from "lucide-react";
import { Booking } from "./BookingListView";

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

interface UserProfileViewProps {
  user: UserData;
  bookings: Booking[];
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div
      className="rounded-xl p-4 flex items-center gap-4"
      style={{
        background: "var(--sky-card)",
        border: "1px solid var(--border-default)",
      }}
    >
      <div
        className="flex items-center justify-center rounded-lg shrink-0"
        style={{
          width: 40,
          height: 40,
          background: "var(--accent-sky-dim)",
          border: "1px solid var(--accent-sky-glow)",
        }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div>
        <div
          className="text-xl font-bold font-mono"
          style={{ color: "var(--text-primary)", lineHeight: 1.2 }}
        >
          {value}
        </div>
        <div className="text-xs mt-0.5" style={{ color: "var(--text-tertiary)" }}>
          {label}
        </div>
      </div>
    </div>
  );
}

export function UserProfileView({ user, bookings }: UserProfileViewProps) {
  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "?";
  const confirmed = bookings.filter(
    b => (b.status ?? "confirmed").toLowerCase() === "confirmed"
  ).length;
  const cancelled = bookings.filter(
    b => (b.status ?? "").toLowerCase() === "cancelled"
  ).length;

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
        Mon profil
      </h2>

      {/* Identity card */}
      <div
        className="rounded-xl p-5 flex items-center gap-5"
        style={{
          background: "var(--sky-panel)",
          border: "1px solid var(--border-default)",
        }}
      >
        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-full text-2xl font-bold shrink-0 select-none"
          style={{
            width: 72,
            height: 72,
            background: "var(--accent-sky-dim)",
            color: "var(--accent-sky)",
            border: "2px solid var(--accent-sky-glow)",
          }}
          aria-hidden="true"
        >
          {initials}
        </div>

        <div className="min-w-0">
          <div
            className="text-xl font-bold text-balance"
            style={{ color: "var(--text-primary)" }}
          >
            {user.firstName} {user.lastName}
          </div>
          {user.email && (
            <div
              className="flex items-center gap-1.5 mt-1 text-sm"
              style={{ color: "var(--text-tertiary)" }}
            >
              <Mail size={13} aria-hidden="true" />
              {user.email}
            </div>
          )}
          {user.role && (
            <span
              className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-widest"
              style={{
                background: "var(--sky-card)",
                color: "var(--text-muted)",
                border: "1px solid var(--border-default)",
                letterSpacing: "0.08em",
              }}
            >
              {user.role}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          icon={<Ticket size={18} style={{ color: "var(--accent-sky)" }} />}
          label="Réservations totales"
          value={bookings.length}
        />
        <StatCard
          icon={<Plane size={18} style={{ color: "#10B981" }} />}
          label="Vols confirmés"
          value={confirmed}
        />
        <StatCard
          icon={<User size={18} style={{ color: "#F59E0B" }} />}
          label="Vols annulés"
          value={cancelled}
        />
      </div>

      {/* Info rows */}
      <div
        className="rounded-xl divide-y"
        style={{
          background: "var(--sky-card)",
          border: "1px solid var(--border-default)",
          divideColor: "var(--border-subtle)",
        }}
      >
        {[
          { label: "Prénom", value: user.firstName, icon: <User size={14} /> },
          { label: "Nom", value: user.lastName, icon: <User size={14} /> },
          { label: "Email", value: user.email, icon: <Mail size={14} /> },
          { label: "Rôle", value: user.role, icon: <Ticket size={14} /> },
        ].map(row => (
          <div key={row.label} className="flex items-center px-4 py-3 gap-3">
            <span style={{ color: "var(--text-muted)" }} aria-hidden="true">
              {row.icon}
            </span>
            <span className="text-xs w-20 shrink-0" style={{ color: "var(--text-muted)" }}>
              {row.label}
            </span>
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              {row.value ?? "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
