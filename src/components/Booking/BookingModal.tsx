import React, { useState } from 'react';
import { X, Calendar, CreditCard } from 'lucide-react';
import { Room } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';

interface BookingModalProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ room, isOpen, onClose }) => {
  const { user } = useAuth();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return 0;
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.ceil(diffDays / 30);
    
    return months * room.price;
  };

  const handleBooking = async () => {
    if (!user || !checkIn || !checkOut) return;
    
    setLoading(true);
    
    try {
      const totalPrice = calculateTotalPrice();
      
      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            room_id: room.id,
            user_id: user.id,
            check_in: checkIn,
            check_out: checkOut,
            total_price: totalPrice,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert([
          {
            booking_id: booking.id,
            amount: totalPrice,
            status: 'pending',
            payment_method: 'qris'
          }
        ]);

      if (paymentError) throw paymentError;

      setStep(2);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Terjadi kesalahan saat membuat booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {step === 1 ? 'Booking Kamar' : 'Pembayaran'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {step === 1 ? (
            <>
              <div className="mb-6">
                <img
                  src={room.image_url}
                  alt={room.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-900">{room.name}</h4>
                  <p className="text-gray-600">{room.description}</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">
                    Rp {room.price.toLocaleString('id-ID')}/bulan
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {checkIn && checkOut && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Total Harga:</span>
                      <span className="text-xl font-bold text-blue-600">
                        Rp {calculateTotalPrice().toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={!checkIn || !checkOut || loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <CreditCard className="mx-auto h-16 w-16 text-green-600" />
                <h4 className="text-lg font-semibold text-gray-900 mt-4">
                  Pembayaran Berhasil Dibuat
                </h4>
                <p className="text-gray-600 mt-2">
                  Scan QR Code berikut untuk melakukan pembayaran
                </p>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg mb-6">
                <div className="w-48 h-48 bg-white mx-auto rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <CreditCard className="mx-auto h-12 w-12 mb-2" />
                    <p className="text-sm">QR Code akan muncul di sini</p>
                    <p className="text-xs mt-2">
                      Total: Rp {calculateTotalPrice().toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Pembayaran akan otomatis terverifikasi setelah Anda melakukan transfer
              </p>

              <button
                onClick={onClose}
                className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};