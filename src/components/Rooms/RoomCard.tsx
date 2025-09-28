import React from 'react';
import { MapPin, Users, Wifi, Car, Coffee, Shield } from 'lucide-react';
import { Room } from '../../types';

interface RoomCardProps {
  room: Room;
  onBook: (room: Room) => void;
}

const facilityIcons: Record<string, React.ReactNode> = {
  'Wi-Fi': <Wifi className="h-4 w-4" />,
  'Parkir': <Car className="h-4 w-4" />,
  'Dapur': <Coffee className="h-4 w-4" />,
  'Keamanan 24 Jam': <Shield className="h-4 w-4" />,
};

export const RoomCard: React.FC<RoomCardProps> = ({ room, onBook }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={room.image_url}
          alt={room.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              room.is_available
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {room.is_available ? 'Tersedia' : 'Tidak Tersedia'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              Rp {room.price.toLocaleString('id-ID')}
            </div>
            <div className="text-sm text-gray-600">/bulan</div>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{room.description}</p>

        <div className="flex items-center text-gray-600 mb-4">
          <Users className="h-4 w-4 mr-2" />
          <span className="text-sm">{room.size}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {room.facilities.map((facility, index) => (
            <div
              key={index}
              className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full"
            >
              {facilityIcons[facility] || <MapPin className="h-4 w-4" />}
              <span className="text-sm text-gray-700">{facility}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onBook(room)}
          disabled={!room.is_available}
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            room.is_available
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {room.is_available ? 'Booking Sekarang' : 'Tidak Tersedia'}
        </button>
      </div>
    </div>
  );
};