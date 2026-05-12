import { useState } from 'react';

const FlightManagement = ({ flights, aircrafts, loading, onCreate, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    flight_number: '',
    departure_airport: '',
    arrival_airport: '',
    departure_time: '',
    arrival_time: '',
    aircraft_id: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    setShowModal(false);
    setFormData({ flight_number: '', departure_airport: '', arrival_airport: '', departure_time: '', arrival_time: '', aircraft_id: '' });
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Chargement...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mes vols</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20 transition-all"
        >
          + Créer un vol
        </button>
      </div>

      <div className="space-y-3">
        {flights.map(flight => (
          <div key={flight.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-lg text-gray-900">{flight.flight_number}</div>
                <div className="text-gray-600">{flight.departure_airport} → {flight.arrival_airport}</div>
                <div className="text-sm text-gray-500">{new Date(flight.departure_time).toLocaleString('fr-FR')}</div>
              </div>
            </div>
            <button
              onClick={() => onDelete(flight.id)}
              className="px-4 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition font-medium"
            >
              Supprimer
            </button>
          </div>
        ))}
        {flights.length === 0 && (
          <div className="text-center py-12 text-gray-500">Aucun vol créé. Créez votre premier vol!</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Créer un vol</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de vol</label>
                <input
                  type="text"
                  placeholder="ex: AF123"
                  value={formData.flight_number}
                  onChange={(e) => setFormData({...formData, flight_number: e.target.value})}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aéroport de départ</label>
                  <input
                    type="text"
                    placeholder="ex: CDG"
                    value={formData.departure_airport}
                    onChange={(e) => setFormData({...formData, departure_airport: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Aéroport d'arrivée</label>
                  <input
                    type="text"
                    placeholder="ex: JFK"
                    value={formData.arrival_airport}
                    onChange={(e) => setFormData({...formData, arrival_airport: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heure de départ</label>
                  <input
                    type="datetime-local"
                    value={formData.departure_time}
                    onChange={(e) => setFormData({...formData, departure_time: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heure d'arrivée</label>
                  <input
                    type="datetime-local"
                    value={formData.arrival_time}
                    onChange={(e) => setFormData({...formData, arrival_time: e.target.value})}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avion</label>
                <select
                  value={formData.aircraft_id}
                  onChange={(e) => setFormData({...formData, aircraft_id: e.target.value})}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                >
                  <option value="">Sélectionner un avion</option>
                  {aircrafts.map(a => (
                    <option key={a.id} value={a.id}>{a.model} ({a.capacity} places)</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20 transition-all"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightManagement;
