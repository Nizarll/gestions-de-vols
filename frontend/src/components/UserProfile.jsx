const UserProfile = ({ user, bookings }) => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Mon Profil</h2>
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{user.firstName} {user.lastName}</h3>
          <span className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-semibold rounded-md uppercase tracking-wider">
            Passager
          </span>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <div className="text-sm font-medium text-gray-600 mb-2">Email</div>
          <div className="text-base font-medium text-gray-900">{user.email}</div>
        </div>
        <div className="pt-6 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-600 mb-2">Statistiques</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{bookings.filter(b => b.status === 'confirmed').length}</div>
              <div className="text-sm text-gray-600 mt-1">Vols à venir</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
              <div className="text-sm text-gray-600 mt-1">Réservations totales</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default UserProfile;
