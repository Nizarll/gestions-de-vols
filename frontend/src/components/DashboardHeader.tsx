"use client";

import { LogOut, Plane } from "lucide-react";

interface DashboardHeaderProps {
  firstName: string;
  lastName: string;
  onLogout: () => void;
}

export function DashboardHeader({ firstName, lastName, onLogout }: DashboardHeaderProps) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-3"
      style={{
        background: "rgba(11,26,46,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 34,
            height: 34,
            background: "var(--accent-sky)",
          }}
          aria-hidden="true"
        >
          <Plane size={16} className="text-white" style={{ transform: "rotate(-45deg)" }} />
        </div>
        <span
          className="text-lg font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Air<span style={{ color: "var(--accent-sky)" }}>Travel</span>
        </span>
      </div>

      {/* User context */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="flex items-center justify-center rounded-full text-sm font-semibold select-none"
          style={{
            width: 34,
            height: 34,
            background: "var(--accent-sky-dim)",
            color: "var(--accent-sky)",
            border: "1px solid var(--accent-sky-glow)",
          }}
          aria-label={`${firstName} ${lastName}`}
        >
          {initials}
        </div>

        {/* Name */}
        <span
          className="hidden sm:block text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          {firstName} {lastName}
        </span>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          style={{
            color: "var(--text-tertiary)",
            border: "1px solid var(--border-default)",
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
          aria-label="Se déconnecter"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  );
}
