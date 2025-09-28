import React, { useState, useEffect } from 'react';
import { Home, Users, DollarSign, Calendar, TrendingUp, Plus, CreditCard as Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Room, Booking } from '../../types';

export const OwnerDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*');

      if (roomsError) throw roomsError;
      setRooms(roomsData || []);

      // Fetch recent bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          room:rooms(*),
          user:profiles(*)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (bookingsError) throw bookingsError;
      setRecentBookings(bookingsData || []);

      // Calculate stats
      const totalRooms = roomsData?.length || 0;
      const availableRooms = roomsData?.filter(room => room.is_available).length || 0;
      const totalBookings = bookingsData?.length || 0;
      const monthlyRevenue = bookingsData?.reduce((sum, booking) => sum + booking.total_price, 0) || 0;

      setStats({
        totalRooms,
        availableRooms,
        totalBookings,
        monthlyRevenue,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRoomAvailability = async (roomId: string, isAvailable: boolean) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ is_available: !isAvailable })
        .eq('id', roomId);

      if (error) throw error;
      
      // Refresh data
      fetchDashboardData();
    } catch (error) {
      console.error('Error toggling room availability:', error);
      alert('Terjadi kesalahan saat mengupdate ketersediaan kamar');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Owner</h2>
        <p className="text-gray-600">Kelola kost dan pantau performa bisnis Anda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Kamar</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalRooms}</p>
            </div>
            <Home className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Kamar Tersedia</p>
              <p className="text-3xl font-bold text-green-600">{stats.availableRooms}</p>
            </div>
            <Calendar className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Booking</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalBookings}</p>
            </div>
            <Users className="h-12 w-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendapatan</p>
              <p className="text-2xl font-bold text-orange-600">
                Rp {stats.monthlyRevenue.toLocaleString('id-ID')}
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rooms Management */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Kelola Kamar</h3>
            <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Tambah Kamar</span>
            </button>
          </div>

          <div className="space-y-4">
            {rooms.map((room) => (
              <div key={room.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{room.name}</h4>
                  <p className="text-sm text-gray-600">
                    Rp {room.price.toLocaleString('id-ID')}/bulan
                  </p>
                  <span
                    className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                      room.is_available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {room.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleRoomAvailability(room.id, room.is_available)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      room.is_available
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {room.is_available ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                  
                  <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  
                  <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Booking Terbaru</h3>
          
          <div className="space-y-4">
            {recentBookings.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Belum ada booking</p>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{booking.room?.name}</h4>
                    <p className="text-sm text-gray-600">{booking.user?.full_name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(booking.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      Rp {booking.total_price.toLocaleString('id-ID')}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'paid'
                          ? 'bg-blue-100 text-blue-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {booking.status === 'confirmed' ? 'Dikonfirmasi' :
                       booking.status === 'paid' ? 'Dibayar' :
                       booking.status === 'pending' ? 'Pending' : 'Dibatalkan'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};