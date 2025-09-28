import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/Auth/AuthForm';
import { Header } from './components/Layout/Header';
import { RoomList } from './components/Rooms/RoomList';
import { BookingList } from './components/Booking/BookingList';
import { OwnerDashboard } from './components/Dashboard/OwnerDashboard';
import { ChatComponent } from './components/Chat/ChatComponent';

function App() {
  const { loading, profile } = useAuth();
  const [currentView, setCurrentView] = useState('rooms');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return <AuthForm />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'rooms':
        return <RoomList />;
      case 'bookings':
        return <BookingList />;
      case 'dashboard':
        return profile.role === 'owner' ? <OwnerDashboard /> : <RoomList />;
      case 'chat':
        return <ChatComponent />;
      default:
        return <RoomList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
}

export default App;