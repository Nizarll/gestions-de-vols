const BookingManagement = ({ bookings, flights, loading }) => {
  if (loading) return <div className="text-center py-12 text-gray-500">Chargement...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Réservations</h2>
      <div className="space-y-3">
        {bookings.map(booking => (
          <div key={booking.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">
                    {booking.passenger?.firstName} {booking.passenger?.lastName}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{booking.passenger?.email}</div>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Vol:</span>
                      <span className="ml-2 font-semibold text-gray-900">{booking.flight?.flight_number}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Siège:</span>
                      <span className="ml-2 font-semibold text-gray-900">{booking.seat_number}</span>
                    </div>
                  </div>
                </div>
              </div>
              <span className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-semibold rounded-md uppercase tracking-wider">
                {booking.status}
              </span>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <div className="text-center py-12 text-gray-500">Aucune réservation pour vos vols</div>
        )}
      </div>
    </div>
  );
};

export default BookingManagement;
