/*
  # Insert sample data for boarding house booking system

  1. Sample Data
    - Insert 5 sample rooms with Indonesian boarding house characteristics
    - Each room has different facilities and pricing
    - All rooms are initially available
*/

-- Insert sample rooms
INSERT INTO rooms (name, description, price, facilities, image_url, is_available, size) VALUES
(
  'Kamar Standard A1',
  'Kamar nyaman dengan fasilitas lengkap di lantai 1. Cocok untuk mahasiswa dan pekerja muda.',
  1200000,
  ARRAY['Wi-Fi', 'AC', 'Kasur', 'Lemari', 'Meja Belajar'],
  'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
  true,
  '3x4 meter'
),
(
  'Kamar Deluxe B2',
  'Kamar premium dengan kamar mandi dalam dan balkon kecil. Fasilitas terlengkap.',
  1800000,
  ARRAY['Wi-Fi', 'AC', 'Kamar Mandi Dalam', 'Balkon', 'Kulkas Mini', 'TV LED'],
  'https://images.pexels.com/photos/1454804/pexels-photo-1454804.jpeg',
  true,
  '4x5 meter'
),
(
  'Kamar Standard A3',
  'Kamar lantai atas dengan jendela besar dan sirkulasi udara baik.',
  1300000,
  ARRAY['Wi-Fi', 'Kipas Angin', 'Kasur', 'Lemari', 'Jendela Besar'],
  'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg',
  true,
  '3x4 meter'
),
(
  'Kamar Family C1',
  'Kamar luas untuk 2 orang dengan 2 kasur single dan ruang lebih lega.',
  2200000,
  ARRAY['Wi-Fi', 'AC', '2 Kasur Single', 'Lemari Besar', 'Meja Belajar', 'Sofa Kecil'],
  'https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg',
  true,
  '5x5 meter'
),
(
  'Kamar Standard B1',
  'Kamar tengah dengan akses mudah ke fasilitas umum kost.',
  1150000,
  ARRAY['Wi-Fi', 'Kipas Angin', 'Kasur', 'Lemari', 'Akses Dapur Bersama'],
  'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
  true,
  '3x3.5 meter'
);