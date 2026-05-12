import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { flightAPI, bookingAPI } from "../services/api";

/* ───────────────────────────────────────────────
   CABIN CONFIG (kept same logic, unified colors)
────────────────────────────────────────────── */
const CABIN_CONFIG = [
  {
    label: "Premiere classe",
    type: "first",
    rows: [1, 2],
    cols: ["A", "C", "D", "F"],
    basePrice: 580,
    tax: 87,
  },
  {
    label: "Business",
    type: "business",
    rows: [3, 4, 5, 6],
    cols: ["A", "B", "C", "D", "E", "F"],
    basePrice: 310,
    tax: 46.5,
  },
  {
    label: "Economie",
    type: "economy",
    rows: Array.from({ length: 24 }, (_, i) => i + 7),
    cols: ["A", "B", "C", "D", "E", "F"],
    basePrice: 149,
    tax: 22.35,
  },
];

const LEFT_COLS = ["A", "B", "C"];

/* ───────────────────────────────────────────────
   SEAT BUTTON (BLUE SYSTEM ONLY)
────────────────────────────────────────────── */
const SeatButton = ({ seat, isSelected, onSelect }) => {
  const col = seat.number.slice(-1);

  const base =
    "relative w-8 h-7 rounded-t-md text-[11px] font-medium border transition-all duration-150 select-none ";

  const state =
    seat.occupied
      ? "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
      : isSelected
      ? "bg-blue-600 border-blue-700 text-white shadow-sm -translate-y-0.5"
      : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:-translate-y-0.5 cursor-pointer";

  return (
    <button
      className={base + state}
      disabled={seat.occupied}
      onClick={() => !seat.occupied && onSelect(seat.number)}
      title={seat.number}
    >
      {col}
      {!seat.occupied && (
        <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-3 h-[3px] bg-current opacity-30 rounded-t-sm" />
      )}
    </button>
  );
};

/* ───────────────────────────────────────────────
   CABIN SECTION (clean blue UI)
────────────────────────────────────────────── */
const CabinSection = ({ cabin, seats, selectedSeat, onSelect }) => {
  const seatMap = Object.fromEntries(seats.map((s) => [s.number, s]));

  const left = cabin.cols.filter((c) => LEFT_COLS.includes(c));
  const right = cabin.cols.filter((c) => !LEFT_COLS.includes(c));

  return (
    <div className="mb-4">
      {/* HEADER */}
      <div className="flex justify-between px-3 py-2 mb-2 rounded-lg border border-gray-200 bg-white">
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
          {cabin.label}
        </span>
      </div>

      {/* SEATS */}
      <div className="space-y-1">
        {cabin.rows.map((row) => (
          <div key={row} className="flex items-center gap-1">
            <span className="w-5 text-[10px] text-gray-400 text-right">
              {row}
            </span>

            <div className="flex gap-0.5">
              {left.map((c) => {
                const seat = seatMap[`${row}${c}`];
                return seat ? (
                  <SeatButton
                    key={seat.number}
                    seat={seat}
                    isSelected={selectedSeat === seat.number}
                    onSelect={onSelect}
                  />
                ) : null;
              })}
            </div>

            <div className="w-5" />

            <div className="flex gap-0.5">
              {right.map((c) => {
                const seat = seatMap[`${row}${c}`];
                return seat ? (
                  <SeatButton
                    key={seat.number}
                    seat={seat}
                    isSelected={selectedSeat === seat.number}
                    onSelect={onSelect}
                  />
                ) : null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────────
   SUMMARY CARD (dashboard style)
────────────────────────────────────────────── */
const SummaryCard = ({ flight, seat, cabin }) => {
  const total = cabin ? cabin.basePrice + cabin.tax : null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
        Booking summary
      </h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Route</span>
          <span className="text-gray-900">
            {flight.departure_airport} → {flight.arrival_airport}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Flight</span>
          <span className="text-gray-900">{flight.flight_number}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Seat</span>
          <span className="text-blue-600 font-semibold">
            {seat || "Not selected"}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t pt-3 space-y-1 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Base</span>
          <span>{cabin ? `$${cabin.basePrice}` : "—"}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Tax</span>
          <span>{cabin ? `$${cabin.tax}` : "—"}</span>
        </div>

        <div className="flex justify-between font-semibold text-lg pt-2 border-t">
          <span>Total</span>
          <span className="text-gray-900">
            {total ? `${total * 10} MAD` : "Select seat"}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────────── */
export default function BookFlight() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [flight, setFlight] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if(booking === 'loading')
      setTimeout(() => navigate('/dashboard'), 1000)
  }, [booking])

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await flightAPI.getOne(id);
        setFlight(res.data);

        // TEMP generator (replace with backend seats)
        const generated = [];
        let i = 0;

        for (const cabin of CABIN_CONFIG) {
          for (const row of cabin.rows) {
            for (const col of cabin.cols) {
              generated.push({
                number: `${row}${col}`,
                occupied: Math.random() < 0.2,
                cabin: cabin.type,
              });
              i++;
            }
          }
        }

        setSeats(generated);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const cabin = selectedSeat
    ? CABIN_CONFIG.find((c) =>
        c.rows.includes(parseInt(selectedSeat))
      )
    : null;

  const handleBook = async () => {
    if (!selectedSeat) return;

    setBooking("loading");
    setError("");

    try {
      await bookingAPI.create({
        flight_id: id,
        seat_number: selectedSeat,
      });

      setBooking("success");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (e) {
      setBooking("error");
      setError(e?.response?.data?.message || "Booking failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center text-gray-400">
        Loading flight…
      </div>
    );
  }

  if (!flight) return null;

return (
  <div className="min-h-screen bg-[#F9FAFB]">

    {/* HEADER */}
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <button
        onClick={() => navigate(-1)}
        className="text-gray-500 hover:text-gray-700 transition"
      >
        ← Back
      </button>

      <div className="font-semibold text-gray-900">
        {flight.departure_airport} → {flight.arrival_airport}
      </div>

      <span className="text-gray-400 font-mono text-sm">
        {flight.flight_number}
      </span>
    </header>

    {/* MAIN 2-COLUMN LAYOUT */}
    <main className="mx-auto px-6 py-6 flex gap-6 items-start">

      <section className="bg-white border border-gray-200 rounded-xl p-6">
        {CABIN_CONFIG.map((c) => (
          <CabinSection
            key={c.type}
            cabin={c}
            seats={seats.filter((s) => s.cabin === c.type)}
            selectedSeat={selectedSeat}
            onSelect={setSelectedSeat}
          />
        ))}
      </section>

      <aside className="flex-1 space-y-4 sticky top-24">

        <SummaryCard
          flight={flight}
          seat={selectedSeat}
          cabin={cabin}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          onClick={handleBook}
          disabled={!selectedSeat || booking === "loading"}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-40 transition"
        >
          {booking === "loading"
            ? "Booking..."
            : booking === "success"
            ? "Booked!"
            : `Confirm ${selectedSeat || "seat"}`}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-100 transition"
        >
          Cancel
        </button>

      </aside>
    </main>
  </div>
);
}
