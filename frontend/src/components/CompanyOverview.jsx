const CompanyOverview = ({ flights, aircrafts, bookings, loading }) => {
  if (loading) return <div className="text-center py-12 text-gray-500">Chargement...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Vue d'ensemble</h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div className="text-sm font-medium text-gray-600">Vols actifs</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{flights.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-sm font-medium text-gray-600">Avions</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{aircrafts.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="text-sm font-medium text-gray-600">Réservations</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{bookings.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-sm font-medium text-gray-600">Taux d'occupation</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {flights.length > 0 ? Math.round((bookings.length / (flights.length * 100)) * 100) : 0}%
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochains vols</h3>
        <div className="space-y-3">
          {flights.slice(0, 5).map(flight => (
            <div key={flight.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {flight.flight_number}: {flight.departure_airport} → {flight.arrival_airport}
                  </div>
                  <div className="text-sm text-gray-600">{new Date(flight.departure_time).toLocaleString('fr-FR')}</div>
                </div>
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
            </div>
          ))}
          {flights.length === 0 && (
            <div className="text-center py-8 text-gray-500">Aucun vol programmé</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;
