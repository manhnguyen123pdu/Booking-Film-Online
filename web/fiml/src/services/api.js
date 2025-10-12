// const API_BASE = 'http://localhost:3001';

// export const filmAPI = {
//   // Films
//   getFilms: () => fetch(`${API_BASE}/films`).then(res => res.json()),
//   getFilmById: (id) => fetch(`${API_BASE}/films/${id}`).then(res => res.json()),

//   // Showtimes
//   getShowtimes: () => fetch(`${API_BASE}/showtimes`).then(res => res.json()),
//   getShowtimesByFilm: (filmId) => 
//     fetch(`${API_BASE}/showtimes?filmId=${filmId}`).then(res => res.json()),

//   // Bookings - QUAN TRỌNG
//   getBookings: () => fetch(`${API_BASE}/bookings`).then(res => res.json()),
//   getBookingsByShowtime: (showtimeId) => 
//     fetch(`${API_BASE}/bookings?showtimeId=${showtimeId}`).then(res => res.json()),

//   createBooking: (bookingData) => 
//     fetch(`${API_BASE}/bookings`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(bookingData),
//     }).then(res => res.json()),
// };


const API_BASE = 'http://localhost:3001';

export const filmAPI = {
  // Films
  getFilms: () => fetch(`${API_BASE}/films`).then(res => res.json()),
  getFilmById: (id) => fetch(`${API_BASE}/films/${id}`).then(res => res.json()),

  // Showtimes
  getShowtimes: () => fetch(`${API_BASE}/showtimes`).then(res => res.json()),
  getShowtimesByFilm: (filmId) =>
    fetch(`${API_BASE}/showtimes?filmId=${filmId}`).then(res => res.json()),

  // Bookings - QUAN TRỌNG
  getBookings: () => fetch(`${API_BASE}/bookings`).then(res => res.json()),
  getBookingsByShowtime: (showtimeId) =>
    fetch(`${API_BASE}/bookings?showtimeId=${showtimeId}`).then(res => res.json()),

  createBooking: (bookingData) =>
    fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    }).then(res => res.json()),

  cancelBooking: (bookingId) =>
    fetch(`${API_BASE}/bookings/${bookingId}`, {
      method: 'DELETE',
    }).then(res => res.json()),

  // Users - THÊM MỚI
  getUsers: () => fetch(`${API_BASE}/users`).then(res => res.json()),
  getUserById: (id) => fetch(`${API_BASE}/users/${id}`).then(res => res.json()),
  updateUser: (id, userData) =>
    fetch(`${API_BASE}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(res => res.json()),
  createUser: (userData) =>
    fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }).then(res => res.json()),

  // Bookings by User - THÊM MỚI
  getBookingsByUser: (userId) =>
    fetch(`${API_BASE}/bookings?userId=${userId}`).then(res => res.json()),

  // Authentication - THÊM MỚI
  login: (credentials) =>
    fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }).then(res => res.json()),

  // Cinemas - THÊM MỚI (nếu cần)
  getCinemas: () => fetch(`${API_BASE}/cinemas`).then(res => res.json()),
  getCinemaById: (id) => fetch(`${API_BASE}/cinemas/${id}`).then(res => res.json()),

  // Rooms - THÊM MỚI (nếu cần)
  getRooms: () => fetch(`${API_BASE}/rooms`).then(res => res.json()),
  getRoomById: (id) => fetch(`${API_BASE}/rooms/${id}`).then(res => res.json()),
};