
import React, { useState } from 'react';
import { Shield, Lock, User, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onAdminLogin: (token: string, admin: any) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onAdminLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Errore durante il login admin');
      }

      const data = await response.json();
      onAdminLogin(data.token, data.admin);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante il login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="w-16 h-16 text-red-500" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            Admin Panel
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Accesso riservato agli amministratori
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-700 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Username amministratore"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-700 placeholder-gray-400 text-white bg-gray-800 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-3 rounded-md">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isLoading ? 'Accesso in corso...' : 'Accedi come Admin'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-400">
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
