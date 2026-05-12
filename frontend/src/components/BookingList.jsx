const BookingList = ({ bookings, loading, onCancel }) => {
  if (loading) return <div className="text-center py-12 text-gray-500">Chargement...</div>;

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' && new Date(b.flight.departure_time) > new Date()
  );
  const pastBookings = bookings.filter((b) => new Date(b.flight.departure_time) <= new Date());

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes réservations</h2>

      {upcomingBookings.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vols à venir</h3>
          <div className="space-y-4">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-semibold rounded-md uppercase tracking-wider">
                    Confirmé
                  </span>
                  <span className="text-sm text-gray-500">Réf: {booking.id}</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {booking.flight.departure_airport}
                  </span>
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span className="text-2xl font-bold text-gray-900">{booking.flight.arrival_airport}</span>
                </div>
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200 mb-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Vol</div>
                    <div className="font-semibold text-gray-900">{booking.flight.flight_number}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Date</div>
                    <div className="font-semibold text-gray-900">
                      {new Date(booking.flight.departure_time).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Siège</div>
                    <div className="font-semibold text-gray-900">{booking.seat_number}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Compagnie</div>
                    <div className="font-semibold text-gray-900">{booking.flight.company?.name}</div>
                  </div>
                </div>
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => onCancel(booking.id)}
                    className="w-full px-4 py-2.5 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition font-medium"
                  >
                    Annuler la réservation
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {pastBookings.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">Historique</h3>
          <div className="space-y-4">
            {pastBookings.map((booking) => (
              <div key={booking.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 opacity-60">
                <div className="flex justify-between items-center mb-4">
                  <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-md uppercase tracking-wider">
                    Effectué
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {booking.flight.departure_airport}
                  </span>
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                  <span className="text-2xl font-bold text-gray-900">{booking.flight.arrival_airport}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Date</div>
                    <div className="font-semibold text-gray-900">
                      {new Date(booking.flight.departure_time).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Siège</div>
                    <div className="font-semibold text-gray-900">{booking.seat_number}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {bookings.length === 0 && (
        <div className="text-center py-12 text-gray-500">Vous n'avez aucune réservation.</div>
      )}
    </div>
  );
};

export default BookingList;
