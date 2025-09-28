import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Booking } from '../../types';
import { useAuth } from '../../hooks/useAuth';

export const BookingList: React.FC = () => {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, profile]);

  const fetchBookings = async () => {
    try {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          room:rooms(*),
          user:profiles(*)
        `)
        .order('created_at', { ascending: false });

      if (profile?.role === 'tenant') {
        query = query.eq('user_id', user?.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;
      
      // Refresh bookings
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Terjadi kesalahan saat mengupdate status booking');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'paid':
        return <DollarSign className="h-5 w-5 text-blue-600" />;
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu Pembayaran';
      case 'paid':
        return 'Sudah Dibayar';
      case 'confirmed':
        return 'Dikonfirmasi';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {profile?.role === 'owner' ? 'Semua Booking' : 'Booking Saya'}
        </h2>
        <p className="text-gray-600">
          {profile?.role === 'owner' 
            ? 'Kelola semua booking dari penyewa'
            : 'Lihat status booking kamar Anda'
          }
        </p>
      </div>

      <div className="space-y-6">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Belum ada booking
            </h3>
            <p className="mt-2 text-gray-600">
              {profile?.role === 'owner' 
                ? 'Belum ada penyewa yang melakukan booking'
                : 'Anda belum memiliki booking kamar'
              }
            </p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(booking.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}
                    >
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {booking.room?.name}
                  </h3>
                  
                  {profile?.role === 'owner' && (
                    <p className="text-gray-600 mb-2">
                      Penyewa: {booking.user?.full_name} ({booking.user?.email})
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Check-in:</span>
                      <p>{new Date(booking.check_in).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div>
                      <span className="font-medium">Check-out:</span>
                      <p>{new Date(booking.check_out).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-2xl font-bold text-blue-600">
                      Rp {booking.total_price.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {profile?.role === 'owner' && booking.status === 'paid' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Konfirmasi
                    </button>
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Tolak
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};