
import React, { useState, useEffect } from 'react';
import { Users, Trash2, Database, BarChart3, Shield, LogOut, AlertTriangle, Key, Eye, EyeOff, X } from 'lucide-react';

interface User {
  id: number;
  username: string;
  created_at: string;
}

interface AdminPanelProps {
  adminToken: string;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ adminToken, onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalExpenses: 0, totalDocuments: 0, totalNotes: 0 });
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [passwordModal, setPasswordModal] = useState<{ type: 'user' | 'admin' | null, userId?: number }>({ type: null });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error' | '', text: string }>({ type: '', text: '' });

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Errore nel caricamento utenti:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Errore nel caricamento statistiche:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (deleteConfirm !== userId) {
      setDeleteConfirm(userId);
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
        setDeleteConfirm(null);
        loadStats(); // Refresh stats
        alert('Utente eliminato con successo');
      } else {
        const error = await response.json();
        alert(`Errore: ${error.error}`);
      }
    } catch (error) {
      console.error('Errore nell\'eliminazione utente:', error);
      alert('Errore durante l\'eliminazione');
    }
  };

  const openPasswordModal = (type: 'user' | 'admin', userId?: number) => {
    setPasswordModal({ type, userId });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordMessage({ type: '', text: '' });
  };

  const closePasswordModal = () => {
    setPasswordModal({ type: null });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordMessage({ type: '', text: '' });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Le password non coincidono' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'La password deve essere di almeno 6 caratteri' });
      return;
    }

    try {
      let url = '';
      let body: any = {};

      if (passwordModal.type === 'user') {
        url = `/api/admin/users/${passwordModal.userId}/password`;
        body = { newPassword: passwordForm.newPassword };
      } else {
        url = '/api/admin/change-password';
        body = { 
          currentPassword: passwordForm.currentPassword, 
          newPassword: passwordForm.newPassword 
        };
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage({ type: 'success', text: 'Password aggiornata con successo!' });
        setTimeout(() => {
          closePasswordModal();
        }, 2000);
      } else {
        setPasswordMessage({ type: 'error', text: data.error || 'Errore nel cambio password' });
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'Errore di connessione' });
    }
  };

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-red-500" />
              <h1 className="text-xl font-bold">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => openPasswordModal('admin')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
              >
                <Key className="w-4 h-4" />
                <span>Cambia Password</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Utenti Totali</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Spese Totali</p>
                <p className="text-2xl font-bold">{stats.totalExpenses}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Documenti Totali</p>
                <p className="text-2xl font-bold">{stats.totalDocuments}</p>
              </div>
              <Database className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Note Totali</p>
                <p className="text-2xl font-bold">{stats.totalNotes}</p>
              </div>
              <Database className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Gestione Utenti</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Creato il</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(user.created_at).toLocaleDateString('it-IT')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openPasswordModal('user', user.id)}
                          className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-md text-sm font-medium transition-colors"
                        >
                          <Key className="w-4 h-4" />
                          <span>Password</span>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className={`inline-flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            deleteConfirm === user.id
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                          }`}
                        >
                          {deleteConfirm === user.id ? (
                            <>
                              <AlertTriangle className="w-4 h-4" />
                              <span>Conferma</span>
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              <span>Elimina</span>
                            </>
                          )}
                        </button>
                        {deleteConfirm === user.id && (
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-500"
                          >
                            Annulla
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {passwordModal.type && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {passwordModal.type === 'admin' ? 'Cambia Password Admin' : 'Cambia Password Utente'}
              </h3>
              <button
                onClick={closePasswordModal}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {passwordMessage.text && (
              <div className={`mb-4 p-3 rounded ${
                passwordMessage.type === 'success' 
                  ? 'bg-green-100 border border-green-400 text-green-700' 
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}>
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {passwordModal.type === 'admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Password Attuale
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowPassword('current')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nuova Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword('new')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Conferma Nuova Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword('confirm')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Cambia Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
