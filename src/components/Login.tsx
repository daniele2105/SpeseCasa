
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
      } else {
        const result = await register(formData.username, formData.password);
        if (!result.success) {
          setError(result.error || 'Errore durante la registrazione');
          return;
        }
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={`min-h-screen ${isLogin ? 'bg-gradient-to-br from-blue-50 to-indigo-100' : 'bg-gradient-to-br from-green-50 to-emerald-100'} flex items-center justify-center p-4`}>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Home className={`w-8 h-8 ${isLogin ? 'text-blue-600' : 'text-green-600'}`} />
            <h1 className="text-2xl font-bold text-gray-900">Casa Manager</h1>
          </div>
          {isLogin ? (
            <div>
              <h2 className="text-xl font-semibold text-blue-700 mb-2">Bentornato!</h2>
              <p className="text-gray-600">Accedi al tuo account</p>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-green-700 mb-2">Nuovo Utente</h2>
              <p className="text-gray-600">Crea il tuo account per iniziare</p>
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  📝 Stai creando un nuovo account per gestire l'acquisto della tua casa
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Nome utente
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Inserisci nome utente"
            />
          </div>

          

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                placeholder="Inserisci password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full ${isLogin ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'} text-white py-3 px-4 rounded-md font-medium focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          >
            {isLoading ? 'Caricamento...' : (isLogin ? '🔐 Accedi' : '✨ Crea Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className={`${isLogin ? 'text-green-600 hover:text-green-700' : 'text-blue-600 hover:text-blue-700'} text-sm font-medium transition-colors`}
          >
            {isLogin ? '🆕 Non hai un account? Registrati' : '👤 Hai già un account? Accedi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
