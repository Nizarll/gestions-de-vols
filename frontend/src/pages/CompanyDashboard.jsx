import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { flightAPI, aircraftAPI, bookingAPI } from '../services/api';
import CompanyOverview from '../components/CompanyOverview';
import FlightManagement from '../components/FlightManagement';
import FleetManagement from '../components/FleetManagement';
import BookingManagement from '../components/BookingManagement';

const CompanyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('overview');
  const [flights, setFlights] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'company') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user && user.role === 'company') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [flightsRes, aircraftsRes, bookingsRes] = await Promise.all([
        flightAPI.getMy(),
        aircraftAPI.getMy(),
        bookingAPI.getMyFlights(),
      ]);

      setFlights(flightsRes.data);
      setAircrafts(aircraftsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFlight = async (flightData) => {
    try {
      await flightAPI.create(flightData);
      loadData();
      alert('Vol créé avec succès !');
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la création du vol');
    }
  };

  const handleUpdateFlight = async (id, flightData) => {
    try {
      await flightAPI.update(id, flightData);
      loadData();
      alert('Vol modifié avec succès !');
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la modification');
    }
  };

  const handleDeleteFlight = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce vol ?')) {
      return;
    }

    try {
      await flightAPI.delete(id);
      loadData();
      alert('Vol supprimé');
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleCreateAircraft = async (aircraftData) => {
    try {
      await aircraftAPI.create(aircraftData);
      loadData();
      alert('Avion ajouté avec succès !');
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'avion');
    }
  };

  const handleUpdateAircraft = async (id, aircraftData) => {
    try {
      await aircraftAPI.update(id, aircraftData);
      loadData();
      alert('Avion modifié avec succès !');
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la modification');
    }
  };

  const handleDeleteAircraft = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet avion ?')) {
      return;
    }

    try {
      await aircraftAPI.delete(id);
      loadData();
      alert('Avion supprimé');
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900">{user.companyName}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">
              {user.firstName} {user.lastName}
            </span>
            <span className="px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-md uppercase tracking-wider">
              Compagnie
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-[240px_1fr] gap-6 lg:grid-cols-1">
          <nav className="bg-white rounded-xl p-3 h-fit shadow-sm lg:flex lg:flex-row lg:gap-1">
            <button
              className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-all mb-1 lg:mb-0 ${
                activeView === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setActiveView('overview')}
            >
              Vue d'ensemble
            </button>
            <button
              className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-all mb-1 lg:mb-0 ${
                activeView === 'flights'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setActiveView('flights')}
            >
              Vols disponibles
            </button>
            <button
              className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-all mb-1 lg:mb-0 ${
                activeView === 'fleet'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setActiveView('fleet')}
            >
              Avions
            </button>
            <button
              className={`w-full px-4 py-3 text-left rounded-lg font-medium transition-all ${
                activeView === 'bookings'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={() => setActiveView('bookings')}
            >
              Reservations
            </button>
          </nav>

          <main className="bg-white rounded-xl p-6 shadow-sm">
            {activeView === 'overview' && (
              <CompanyOverview
                flights={flights}
                aircrafts={aircrafts}
                bookings={bookings}
                loading={loading}
              />
            )}

            {activeView === 'flights' && (
              <FlightManagement
                flights={flights}
                aircrafts={aircrafts}
                loading={loading}
                onCreate={handleCreateFlight}
                onUpdate={handleUpdateFlight}
                onDelete={handleDeleteFlight}
              />
            )}

            {activeView === 'fleet' && (
              <FleetManagement
                aircrafts={aircrafts}
                flights={flights}
                loading={loading}
                onCreate={handleCreateAircraft}
                onUpdate={handleUpdateAircraft}
                onDelete={handleDeleteAircraft}
              />
            )}

            {activeView === 'bookings' && (
              <BookingManagement bookings={bookings} flights={flights} loading={loading} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
