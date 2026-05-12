"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SidebarNav, ActiveView } from "@/components/dashboard/SidebarNav";
import { FlightSearchView } from "@/components/dashboard/FlightSearchView";
import { BookingListView, Booking } from "@/components/dashboard/BookingListView";
import { UserProfileView } from "@/components/dashboard/UserProfileView";
import { SearchParams } from "@/components/dashboard/SearchBar";
import { Flight } from "@/components/dashboard/FlightCard";

/* ─── Mock data ──────────────────────────────────────────────────────────────
   These replace the real API calls that exist in the original dashboard.
   Swap them back out for the real flightAPI / bookingAPI hooks when integrating.
 ──────────────────────────────────────────────────────────────────────────── */
const MOCK_FLIGHTS: Flight[] = [
  {
    id: 1,
    flight_number: "AT 201",
    departure_airport: "CDG",
    arrival_airport: "JFK",
    departure_time: "2025-08-12T08:30:00Z",
    company: { company_name: "Air France" },
  },
  {
    id: 2,
    flight_number: "AT 302",
    departure_airport: "ORY",
    arrival_airport: "LHR",
    departure_time: "2025-08-14T11:00:00Z",
    company: { company_name: "British Airways" },
  },
  {
    id: 3,
    flight_number: "AT 415",
    departure_airport: "CDG",
    arrival_airport: "DXB",
    departure_time: "2025-08-20T22:15:00Z",
    company: { company_name: "Emirates" },
  },
  {
    id: 4,
    flight_number: "AT 580",
    departure_airport: "LYS",
    arrival_airport: "MAD",
    departure_time: "2025-09-01T07:45:00Z",
    company: { company_name: "Iberia" },
  },
  {
    id: 5,
    flight_number: "AT 633",
    departure_airport: "NCE",
    arrival_airport: "FCO",
    departure_time: "2025-09-05T16:20:00Z",
    company: { company_name: "Alitalia" },
  },
  {
    id: 6,
    flight_number: "AT 777",
    departure_airport: "CDG",
    arrival_airport: "NRT",
    departure_time: "2025-09-10T13:55:00Z",
    company: { company_name: "Japan Airlines" },
  },
];

const MOCK_BOOKINGS: Booking[] = [
  {
    id: 101,
    seat_number: "12A",
    status: "confirmed",
    flight: {
      flight_number: "AT 201",
      departure_airport: "CDG",
      arrival_airport: "JFK",
      departure_time: "2025-08-12T08:30:00Z",
      company: { company_name: "Air France" },
    },
  },
  {
    id: 102,
    seat_number: "3C",
    status: "cancelled",
    flight: {
      flight_number: "AT 302",
      departure_airport: "ORY",
      arrival_airport: "LHR",
      departure_time: "2025-08-14T11:00:00Z",
      company: { company_name: "British Airways" },
    },
  },
];

const MOCK_USER = {
  firstName: "Sophie",
  lastName: "Martin",
  email: "sophie.martin@example.com",
  role: "user",
};

/* ─── Dashboard ────────────────────────────────────────────────────────────── */
export default function UserDashboard() {
  const [activeView, setActiveView] = useState<ActiveView>("search");
  const [allFlights, setAllFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  /* Simulate flight load */
  useEffect(() => {
    setLoadingFlights(true);
    const t = setTimeout(() => {
      setAllFlights(MOCK_FLIGHTS);
      setFilteredFlights(MOCK_FLIGHTS);
      setLoadingFlights(false);
    }, 900);
    return () => clearTimeout(t);
  }, []);

  /* Load bookings when switching to that view */
  useEffect(() => {
    if (activeView === "bookings") {
      setLoadingBookings(true);
      const t = setTimeout(() => {
        setBookings(MOCK_BOOKINGS);
        setLoadingBookings(false);
      }, 700);
      return () => clearTimeout(t);
    }
  }, [activeView]);

  /* Auto-dismiss notification */
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 3500);
    return () => clearTimeout(t);
  }, [notification]);

  const handleSearch = useCallback(
    ({ departure, arrival, date }: SearchParams) => {
      let result = allFlights;
      if (departure)
        result = result.filter(f =>
          f.departure_airport.toLowerCase().includes(departure.toLowerCase())
        );
      if (arrival)
        result = result.filter(f =>
          f.arrival_airport.toLowerCase().includes(arrival.toLowerCase())
        );
      if (date)
        result = result.filter(f => f.departure_time.startsWith(date));
      setFilteredFlights(result);
    },
    [allFlights]
  );

  const handleBook = (flightId: number | string) => {
    const flight = allFlights.find(f => f.id === flightId);
    if (!flight) return;
    const newBooking: Booking = {
      id: Date.now(),
      seat_number: "A1",
      status: "confirmed",
      flight: {
        flight_number: flight.flight_number,
        departure_airport: flight.departure_airport,
        arrival_airport: flight.arrival_airport,
        departure_time: flight.departure_time,
        company: flight.company,
      },
    };
    setBookings(prev => [newBooking, ...prev]);
    setNotification({ type: "success", message: "Réservation confirmée !" });
    setActiveView("bookings");
  };

  const handleCancelBooking = (bookingId: number | string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, status: "cancelled" } : b
      )
    );
    setNotification({ type: "error", message: "Réservation annulée." });
  };

  const handleLogout = () => {
    setNotification({ type: "success", message: "Déconnecté avec succès." });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--sky-midnight)" }}
    >
      <DashboardHeader
        firstName={MOCK_USER.firstName}
        lastName={MOCK_USER.lastName}
        onLogout={handleLogout}
      />

      {/* Notification toast */}
      {notification && (
        <div
          role="alert"
          aria-live="polite"
          className="fixed top-16 right-4 z-50 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all"
          style={{
            background:
              notification.type === "success"
                ? "rgba(16,185,129,0.12)"
                : "rgba(239,68,68,0.12)",
            border: `1px solid ${
              notification.type === "success"
                ? "rgba(16,185,129,0.3)"
                : "rgba(239,68,68,0.3)"
            }`,
            color:
              notification.type === "success" ? "#10B981" : "#EF4444",
            backdropFilter: "blur(12px)",
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <aside className="md:w-48 shrink-0">
            <SidebarNav activeView={activeView} onViewChange={setActiveView} />
          </aside>

          {/* Main content */}
          <main
            className="flex-1 min-w-0 rounded-xl p-5 sm:p-6"
            style={{
              background: "var(--sky-deep)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            {activeView === "search" && (
              <FlightSearchView
                flights={filteredFlights}
                loading={loadingFlights}
                onSearch={handleSearch}
                onBook={handleBook}
              />
            )}
            {activeView === "bookings" && (
              <BookingListView
                bookings={bookings}
                loading={loadingBookings}
                onCancel={handleCancelBooking}
              />
            )}
            {activeView === "profile" && (
              <UserProfileView user={MOCK_USER} bookings={bookings} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
