import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { flightAPI, bookingAPI } from '../services/api';
import BookingList from '../components/BookingList';
import UserProfile from '../components/UserProfile';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState('search');
  const [allFlights, setAllFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFlights = async () => {
      setLoading(true);
      try {
        const res = await flightAPI.getAll();
        setAllFlights(res.data);
        setFilteredFlights(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
  }, []);

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'user') navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    if (activeView === 'bookings') loadBookings();
  }, [activeView]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingAPI.getMy();
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = ({ departure, arrival, date }) => {
    let result = allFlights;

    if (departure) {
      result = result.filter(f =>
        f.departure_airport.toLowerCase().includes(departure.toLowerCase())
      );
    }

    if (arrival) {
      result = result.filter(f =>
        f.arrival_airport.toLowerCase().includes(arrival.toLowerCase())
      );
    }

    if (date) {
      result = result.filter(f =>
        f.departure_time.startsWith(date)
      );
    }

    setFilteredFlights(result);
  };

  const handleBook = async (flightId) => {
    try {
      await bookingAPI.create({ flight_id: flightId, seat_number: 'A1' });
      alert('Réservation confirmée !');
      setActiveView('bookings');
    } catch (error) {
    alert(error.response?.data?.message || 'Erreur');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">

      {/* TOP BAR */}
      <header className="fixed top-0 z-50 w-full h-16 flex justify-between items-center px-6 bg-white border-b border-gray-200">
        <div className="font-bold text-blue-600 text-xl">Dashboard</div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            {user.firstName} {user.lastName}
          </span>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-gray-50 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex pt-16">

        {/* SIDEBAR */}
        <aside className="w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-4 flex flex-col gap-2">

          <button
            onClick={() => setActiveView('search')}
            className={`px-4 py-3 rounded-lg text-left font-medium transition ${activeView === 'search' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Rechercher un vol
          </button>

          <button
            onClick={() => setActiveView('bookings')}
            className={`px-4 py-3 rounded-lg text-left font-medium transition ${activeView === 'bookings' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Mes réservations
          </button>

          <button
            onClick={() => setActiveView('profile')}
            className={`px-4 py-3 rounded-lg text-left font-medium transition ${activeView === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            Mon profil
          </button>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-8">

          {activeView === 'search' && (
            <div className="space-y-6">

               <h1 className="text-3xl font-bold">Où souhaitez-vous aller ?</h1>

              {/* SEARCH BAR */}
              <SearchBar onSearch={handleSearch} />

              {loading ? (
                <p className="text-gray-500">Chargement...</p>
              ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredFlights.map(flight => (
                      <FlightCard key={flight.id} flight={flight} onBook={handleBook} />
                    ))}
                  </div>
                )}

            </div>
          )}

          {activeView === 'bookings' && (
            <BookingList bookings={bookings} loading={loading} />
          )}

          {activeView === 'profile' && (
            <UserProfile user={user} bookings={bookings} />
          )}

        </main>
      </div>
    </div>
  );
};

export default UserDashboard;

/* SEARCH BAR */
const SearchBar = ({ onSearch }) => {
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch({ departure, arrival, date });
      }}
      className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-6 rounded-xl border border-gray-200"
    >
      <input
        className="px-3 py-2 border rounded-lg"
        placeholder="Départ"
        value={departure}
        onChange={e => setDeparture(e.target.value)}
      />

      <input
        className="px-3 py-2 border rounded-lg"
        placeholder="Arrivée"
        value={arrival}
        onChange={e => setArrival(e.target.value)}
      />

      <input
        type="date"
        className="px-3 py-2 border rounded-lg"
        value={date}
        onChange={e => setDate(e.target.value)}
      />

      <button className="bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Rechercher
      </button>
    </form>
  );
};

const FlightCard = ({ flight, onBook }) => {
  console.log(flight)
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/view/${flight.id}`)} className="bg-white border border-gray-200 rounded-xl p-5 flex justify-between items-center hover:shadow-md transition">
      <div className="space-y-4">
        <div className="h-32 w-full overflow-hidden rounded-md">
          <img src={flight.image} />
        </div>
        <div>
          <p className="text-xl font-bold">
            {flight.departure_airport} → {flight.arrival_airport}
          </p>

          <p className="text-gray-500 text-sm">
            {flight.flight_number} | {flight.company.company_name}
          </p>

          <p className="text-xs text-gray-400">
            {new Date(flight.departure_time).toLocaleString()}
          </p>
        </div>

          <button
            onClick={() => onBook(flight.id)}
            className="px-4 py-2 w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Réserver
          </button>
        </div>
      </div>
  );
};

