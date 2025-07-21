import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Expenses from './components/Expenses';
import Documents from './components/Documents';
import Notes from './components/Notes';
import Checklist from './components/Checklist';
import Calculator from './components/Calculator';
import ChangePassword from './components/ChangePassword';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import './index.css';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return <Expenses />;
      case 'documents':
        return <Documents />;
      case 'notes':
        return <Notes />;
      case 'checklist':
        return <Checklist />;
      case 'calculator':
        return <Calculator />;
      case 'change-password':
        return <ChangePassword />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

function App() {
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleAdminLogin = (token: string, admin: any) => {
    setAdminToken(token);
    localStorage.setItem('adminToken', token);
    setShowAdminLogin(false);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
    setShowAdminLogin(false);
  };

  // Admin access via URL parameter
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      setShowAdminLogin(true);
    }
  }, []);

  // Admin panel view
  if (adminToken && !showAdminLogin) {
    return <AdminPanel adminToken={adminToken} onLogout={handleAdminLogout} />;
  }

  // Admin login view
  if (showAdminLogin) {
    return <AdminLogin onAdminLogin={handleAdminLogin} />;
  }

  // Regular user view
  return (
    <AuthProvider>
      <div className="relative">
        <AppContent />
        {/* Admin access button */}
        <button
          onClick={() => setShowAdminLogin(true)}
          className="fixed bottom-4 right-4 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
          title="Accesso Admin"
        >
          🔒
        </button>
      </div>
    </AuthProvider>
  );
}

export default App;