import React from 'react';
import { LogOut, MessageCircle, User, Home } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { profile, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Home className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">KostKu</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onViewChange('rooms')}
              className={`px-3 py-2 text-sm font-medium ${
                currentView === 'rooms'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Kamar
            </button>
            
            {profile?.role === 'owner' && (
              <button
                onClick={() => onViewChange('dashboard')}
                className={`px-3 py-2 text-sm font-medium ${
                  currentView === 'dashboard'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Dashboard
              </button>
            )}

            <button
              onClick={() => onViewChange('bookings')}
              className={`px-3 py-2 text-sm font-medium ${
                currentView === 'bookings'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              {profile?.role === 'owner' ? 'Semua Booking' : 'Booking Saya'}
            </button>

            <button
              onClick={() => onViewChange('chat')}
              className={`px-3 py-2 text-sm font-medium ${
                currentView === 'chat'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <MessageCircle className="h-4 w-4" />
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-700">{profile?.full_name}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {profile?.role === 'owner' ? 'Pemilik' : 'Penyewa'}
              </span>
            </div>
            
            <button
              onClick={signOut}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};