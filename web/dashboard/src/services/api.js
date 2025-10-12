const API_BASE = 'http://localhost:3001'

export const authAPI = {
  login: async (credentials) => {
    try {
      // Gọi API login theo cách bạn đã làm trước đó
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const userData = await response.json()

      // Kiểm tra role admin
      if (userData.role !== 'admin') {
        throw new Error('Access denied. Admin only.')
      }

      return userData

    } catch (error) {
      // Fallback: Nếu API login không tồn tại, check trực tiếp trong users
      const usersResponse = await fetch(`${API_BASE}/users`)
      const users = await usersResponse.json()

      const user = users.find(u =>
        u.email === credentials.email && u.password === credentials.password
      )

      if (user && user.role === 'admin') {
        return {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar || '👨‍💼'
        }
      } else {
        throw new Error('Invalid credentials or not admin')
      }
    }
  }
}

export const dashboardAPI = {

  getUsers: () => fetch(`${API_BASE}/users`).then(res => res.json()),
  getFilms: () => fetch(`${API_BASE}/films`).then(res => res.json()),
  getBookings: () => fetch(`${API_BASE}/bookings`).then(res => res.json()),

  // Thêm các API khác nếu cần
  getShowtimes: () => fetch(`${API_BASE}/showtimes`).then(res => res.json()),
  getCinemas: () => fetch(`${API_BASE}/cinemas`).then(res => res.json()),
  addFilm: async (filmData) => {
    const response = await fetch('http://localhost:3001/films', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filmData),
    });
    return await response.json();
  },
  addShowtime: async (showtimeData) => {
    const response = await fetch(`${API_BASE}/showtimes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(showtimeData),
    });
    return await response.json();
  },
  getCinemas: () => fetch(`${API_BASE}/cinemas`).then(res => res.json()),
  updateShowtime: async (id, showtimeData) => {
    const response = await fetch(`${API_BASE}/showtimes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(showtimeData),
    });
    return await response.json();
  },
  deleteShowtime: async (id) => {
    const response = await fetch(`${API_BASE}/showtimes/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  }
}