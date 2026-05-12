import { useState } from 'react';

const FlightSearch = ({ flights, loading, onSearch, onBook }) => {
  const [filters, setFilters] = useState({
    departure: '',
    arrival: '',
    date: '',
  });
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [seatNumber, setSeatNumber] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleBookClick = (flight) => {
    setSelectedFlight(flight);
    setSeatNumber('');
  };

  const handleConfirmBook = () => {
    if (!seatNumber.trim()) {
      alert('Veuillez sélectionner un siège');
      return;
    }
    onBook(selectedFlight.id, seatNumber);
    setSelectedFlight(null);
    setSeatNumber('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Rechercher un vol</h2>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="grid grid-cols-4 gap-4 md:grid-cols-1">
          <input
            type="text"
            placeholder="Aéroport de départ (ex: CDG)"
            value={filters.departure}
            onChange={(e) => setFilters({ ...filters, departure: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
          />
          <input
            type="text"
            placeholder="Aéroport d'arrivée (ex: JFK)"
            value={filters.arrival}
            onChange={(e) => setFilters({ ...filters, arrival: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
          />
          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Chargement...</div>
      ) : (
        <div className="space-y-4">
          {flights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:border-gray-300 hover:shadow-lg transition-all"
            >
              <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{flight.departure_airport}</div>
                  <div className="text-gray-600 text-sm mt-1">
                    {new Date(flight.departure_time).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-20 h-0.5 bg-gray-300"></div>
                  <div className="mx-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <div className="w-20 h-0.5 bg-gray-300"></div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{flight.arrival_airport}</div>
                  <div className="text-gray-600 text-sm mt-1">
                    {new Date(flight.arrival_time).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Vol</div>
                  <div className="font-semibold text-gray-900">{flight.flight_number}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Avion</div>
                  <div className="font-semibold text-gray-900">{flight.aircraft?.model}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Places disponibles</div>
                  <div className="font-semibold text-gray-900">
                    {flight.available_seats || 0} / {flight.aircraft?.capacity || 0}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-1">Compagnie</div>
                  <div className="font-semibold text-gray-900">{flight.company?.name}</div>
                </div>
              </div>

              <button
                onClick={() => handleBookClick(flight)}
                disabled={!flight.available_seats}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
              >
                {flight.available_seats ? 'Réserver ce vol' : 'Complet'}
              </button>
            </div>
          ))}

          {flights.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucun vol trouvé. Essayez de modifier vos critères de recherche.
            </div>
          )}
        </div>
      )}

      {selectedFlight && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedFlight(null)}
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Réserver le vol {selectedFlight.flight_number}
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedFlight.departure_airport} → {selectedFlight.arrival_airport}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de siège</label>
              <input
                type="text"
                placeholder="ex: 12A"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedFlight(null)}
                className="flex-1 px-4 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmBook}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20 transition-all"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
