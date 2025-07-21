import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Home, Receipt, FileText, StickyNote, CheckSquare, Calculator, LogOut, Key, User, Bell } from 'lucide-react'; // Aggiunto Bell

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'expenses', label: 'Spese', icon: Receipt },
    { id: 'documents', label: 'Documenti', icon: FileText },
    { id: 'notes', label: 'Note', icon: StickyNote },
    { id: 'checklist', label: 'Checklist', icon: CheckSquare },
    { id: 'calculator', label: 'Calcolatrice', icon: Calculator },
    { id: 'change-password', label: 'Cambia Password', icon: Key },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <Home className="w-8 h-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Casa Manager</h1>
            </div>
            <nav className="space-y-2">
              {menuItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onTabChange(id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <header className="bg-white shadow-sm border-b">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Acquisto Casa
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user?.username}</span>
                  </div>
                  <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Bell className="w-4 h-4" />
                    <span>Notifiche</span>
                  </button>
                  <button 
                    onClick={logout}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Esci</span>
                  </button>
                </div>
              </div>
            </div>
          </header>
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;