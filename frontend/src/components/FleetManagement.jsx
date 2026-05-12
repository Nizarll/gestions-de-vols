import { useState } from 'react';

const FleetManagement = ({ aircrafts, flights, loading, onCreate, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ model: '', capacity: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    setShowModal(false);
    setFormData({ model: '', capacity: '' });
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Chargement...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Ma flotte</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20 transition-all"
        >
          + Ajouter un avion
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {aircrafts.map(aircraft => (
          <div key={aircraft.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div className="font-semibold text-lg text-gray-900">{aircraft.model}</div>
            </div>
            <div className="text-gray-600 mb-4">
              <span className="text-sm font-medium text-gray-600">Capacité:</span>
              <span className="ml-2 font-semibold text-gray-900">{aircraft.capacity} places</span>
            </div>
            <button
              onClick={() => onDelete(aircraft.id)}
              className="w-full px-4 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition font-medium"
            >
              Supprimer
            </button>
          </div>
        ))}
        {aircrafts.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-500">
            Aucun avion dans votre flotte. Ajoutez votre premier avion!
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Ajouter un avion</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modèle</label>
                <input
                  type="text"
                  placeholder="ex: Boeing 737"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacité</label>
                <input
                  type="number"
                  placeholder="ex: 180"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  required
                  min="1"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                />
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
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetManagement;
