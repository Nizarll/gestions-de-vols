"use client";

import { Search, Ticket, User } from "lucide-react";

export type ActiveView = "search" | "bookings" | "profile";

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: "search",
    label: "Rechercher",
    icon: <Search size={16} />,
    description: "Trouver un vol",
  },
  {
    id: "bookings",
    label: "Réservations",
    icon: <Ticket size={16} />,
    description: "Mes billets",
  },
  {
    id: "profile",
    label: "Profil",
    icon: <User size={16} />,
    description: "Mon compte",
  },
];

interface SidebarNavProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
}

export function SidebarNav({ activeView, onViewChange }: SidebarNavProps) {
  return (
    <nav
      aria-label="Navigation principale"
      className="flex flex-row gap-1 md:flex-col p-2 rounded-xl"
      style={{
        background: "var(--sky-deep)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {navItems.map((item) => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            aria-current={isActive ? "page" : undefined}
            className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 md:w-full text-left"
            style={{
              background: isActive ? "var(--accent-sky-dim)" : "transparent",
              color: isActive ? "var(--accent-sky)" : "var(--text-tertiary)",
              border: isActive
                ? "1px solid var(--accent-sky-glow)"
                : "1px solid transparent",
            }}
            onMouseEnter={e => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                (e.currentTarget as HTMLButtonElement).style.background = "var(--sky-panel)";
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-tertiary)";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }
            }}
          >
            {/* Active bar */}
            {isActive && (
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
                style={{
                  width: 3,
                  height: "60%",
                  background: "var(--accent-sky)",
                }}
                aria-hidden="true"
              />
            )}
            <span className="shrink-0">{item.icon}</span>
            <span className="hidden md:flex flex-col">
              <span>{item.label}</span>
              <span
                className="text-xs font-normal leading-none mt-0.5"
                style={{ color: isActive ? "rgba(59,139,235,0.7)" : "var(--text-muted)" }}
              >
                {item.description}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
