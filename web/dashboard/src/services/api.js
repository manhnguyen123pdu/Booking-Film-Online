const API_BASE = 'https://1i5z0-8080.csb.app'

export const authAPI = {
  login: async (credentials) => {
    try {
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
    const response = await fetch(`${API_BASE}/films `, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filmData),
    });
    return await response.json();
  },
  updateFilm: async (id, filmData) => {
    const response = await fetch(`${API_BASE}/films/${id}`, {
      method: 'PUT',
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
  deleteFilm: async (id) => {
  const response = await fetch(`${API_BASE}/films/${id}`, {
    method: 'DELETE',
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
  },


  // booking
   getBookings: () => fetch(`${API_BASE}/bookings`).then(res => res.json()),
  
  updateBookingStatus: async (id, status) => {
    const response = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return await response.json();
  },

  deleteBooking: async (id) => {
    const response = await fetch(`${API_BASE}/bookings/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  },

  //  
   
  getUsers: () => fetch(`${API_BASE}/users`).then(res => res.json()),
  
  addUser: async (userData) => {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  },
  
  updateUser: async (id, userData) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return await response.json();
  },
  
  updateUserStatus: async (id, status) => {
    // First get the current user data
    const user = await fetch(`${API_BASE}/users/${id}`).then(res => res.json());
    
    // Update only the status field
    const updatedUser = {
      ...user,
      status: status
    };
    
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });
    return await response.json();
  },
  
  deleteUser: async (id) => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  }

}



export const filmAPI = {
  // Lấy danh sách phim
  getFilms: () => fetch(`${API_BASE}/films`).then(res => res.json()),

  // Lấy danh sách xuất chiếu
  getShowtimes: () => fetch(`${API_BASE}/showtimes`).then(res => res.json()),

  // Lấy bookings theo showtime
  getBookingsByShowtime: async (showtimeId) => {
    const bookings = await fetch(`${API_BASE}/bookings`).then(res => res.json());
    return bookings.filter(booking => booking.showtimeId === showtimeId);
  },

  // Lấy tất cả bookings (cho admin)
  getAllBookings: () => fetch(`${API_BASE}/bookings`).then(res => res.json()),

  // Lấy thông tin phòng chiếu
  getRooms: () => fetch(`${API_BASE}/rooms`).then(res => res.json()),

  // Thêm film mới
  addFilm: async (filmData) => {
    const response = await fetch(`${API_BASE}/films`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filmData),
    });
    return await response.json();
  },

  // Cập nhật film
  updateFilm: async (id, filmData) => {
    const response = await fetch(`${API_BASE}/films/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filmData),
    });
    return await response.json();
  },

  // Xóa film
  deleteFilm: async (id) => {
    const response = await fetch(`${API_BASE}/films/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  },

  // Thêm xuất chiếu mới
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

  // Cập nhật xuất chiếu
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

  // Xóa xuất chiếu
  deleteShowtime: async (id) => {
    const response = await fetch(`${API_BASE}/showtimes/${id}`, {
      method: 'DELETE',
    });
    return await response.json();
  }
};

