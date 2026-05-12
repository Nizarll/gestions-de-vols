import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [accountType, setAccountType] = useState('user');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    companyName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const user = await login(formData.email, formData.password);
        navigate(user.role === 'company' ? '/company' : '/dashboard');
      } else {
        const userData = {
          email: formData.email,
          password: formData.password,
          role: accountType,
          ...(accountType === 'user'
            ? {
                first_name: formData.firstName,
                last_name: formData.lastName,
              }
            : {
                company_name: formData.companyName,
                first_name: formData.firstName,
                last_name: formData.lastName,
              }),
        };

        const user = await register(userData);
        navigate(user.role === 'company' ? '/company' : '/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-3">
            <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <h1 className="text-4xl font-bold text-gray-900">AirTravel</h1>
          </div>
          <p className="text-gray-600">Plateforme de gestion et réservation de vols</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
            <button
              className={`px-6 py-2.5 rounded-md font-medium text-sm transition-all ${
                isLogin
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Connexion
            </button>
            <button
              className={`px-6 py-2.5 rounded-md font-medium text-sm transition-all ${
                !isLogin
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Nouveau compte
            </button>
          </div>
        </div>

        {/* Split Layout for Account Type */}
        <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Passenger Path */}
          <button
            type="button"
            onClick={() => setAccountType('user')}
            className={`relative bg-white rounded-xl p-8 border-2 transition-all ${
              accountType === 'user' && !isLogin
                ? 'border-blue-600 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            } ${isLogin ? 'hidden' : ''}`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                accountType === 'user' && !isLogin ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <svg className={`w-8 h-8 ${accountType === 'user' && !isLogin ? 'text-blue-600' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Passager</h3>
              <p className="text-sm text-gray-600">Recherchez et réservez vos vols</p>
            </div>
            {accountType === 'user' && !isLogin && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>

          {/* Company Path */}
          <button
            type="button"
            onClick={() => setAccountType('company')}
            className={`relative bg-white rounded-xl p-8 border-2 transition-all ${
              accountType === 'company' && !isLogin
                ? 'border-blue-600 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            } ${isLogin ? 'hidden' : ''}`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                accountType === 'company' && !isLogin ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <svg className={`w-8 h-8 ${accountType === 'company' && !isLogin ? 'text-blue-600' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Compagnie aérienne</h3>
              <p className="text-sm text-gray-600">Gérez votre flotte et vos vols</p>
            </div>
            {accountType === 'company' && !isLogin && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        </div>

        {/* Form */}
        <div className="max-w-md mx-auto mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && accountType === 'company' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la compagnie
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    placeholder="Air France"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                  />
                </div>
              )}

              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="Jean"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Dupont"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="vous@example.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none transition-all"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-600/20 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
