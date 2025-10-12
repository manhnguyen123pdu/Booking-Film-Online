// RoomManagement.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { filmAPI } from '../services/api';
import './RoomManagement.css';

const RoomManagement = () => {
  const [films, setFilms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomStatus, setRoomStatus] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [filmsData, showtimesData] = await Promise.all([
          filmAPI.getFilms(),
          filmAPI.getShowtimes()
        ]);
        setFilms(filmsData);
        setShowtimes(showtimesData);
        const allBookings = await filmAPI.getAllBookings();
        setBookings(allBookings);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredShowtimes = useMemo(() => {
    if (!selectedFilm) return showtimes;
    return showtimes.filter(st => st.filmId === selectedFilm.id);
  }, [selectedFilm, showtimes]);

  const calculateRoomStatus = async (showtimeId) => {
    try {
      const roomBookings = bookings.filter(booking => booking.showtimeId === showtimeId);
      const bookedSeats = roomBookings.reduce((seats, booking) => [...seats, ...booking.seats], []);
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const seatLayout = [];
console.log(bookedSeats)
      rows.forEach(row => {
        for (let number = 1; number <= 12; number++) {
          const seatId = `${row}${number}`;
          const isBooked = bookedSeats.includes(seatId);
          let type = 'standard';
          if (row === 'A' || row === 'B') type = 'vip';
          else if (row === 'G' || row === 'H') type = 'couple';
          seatLayout.push({ id: seatId, row, number, isBooked, type });
        }
      });

      const totalSeats = seatLayout.length;
      const bookedSeatsCount = seatLayout.filter(seat => seat.isBooked).length;
      const availableSeats = totalSeats - bookedSeatsCount;
      const occupancyRate = (bookedSeatsCount / totalSeats) * 100;

      setRoomStatus(prev => ({
        ...prev,
        [showtimeId]: {
          seatLayout,
          statistics: {
            totalSeats,
            bookedSeats: bookedSeatsCount,
            availableSeats,
            occupancyRate: Math.round(occupancyRate)
          }
        }
      }));
    } catch (error) {
      console.error('Error calculating room status:', error);
    }
  };

  const handleFilmSelect = (film) => {
    setSelectedFilm(film);
    setSelectedShowtime(null);
    setRoomStatus({});
  };

  const handleShowtimeSelect = async (showtime) => {
    setSelectedShowtime(showtime);
    if (!roomStatus[showtime.id]) await calculateRoomStatus(showtime.id);
  };

  const getFilmById = (filmId) => films.find(film => film.id === filmId);

  if (loading) {
    return (
      <div className="rm-loading">
        <div className="rm-spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="rm-container">
      {/* Header */}
      <div className="rm-header">
        <h1>🎬 Quản Lý Rạp Chiếu Phim</h1>
        <p>Xem trạng thái các phòng chiếu và quản lý lịch chiếu</p>
      </div>

      <div className="rm-content">
        {/* Film Selection */}
        <div className="rm-section-select">
          <div className="rm-film-grid">
            <h2>Chọn Phim</h2>
            <div className="rm-film-list">
              {films.map(film => (
                <div
                  key={film.id}
                  className={`rm-film-card ${selectedFilm?.id === film.id ? 'rm-selected' : ''}`}
                  onClick={() => handleFilmSelect(film)}
                >
                  <img src={film.img} alt={film.nameFilm} className="rm-film-poster" />
                  <div className="rm-film-info">
                    <h3>{film.nameFilm}</h3>
                    <p className="rm-duration">{film.duration} phút</p>
                    <p className="rm-genre">{film.genre}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Showtime Selection */}
          {selectedFilm && (
            <div className="rm-showtime-section">
              <h2>Chọn Xuất Chiếu - {selectedFilm.nameFilm}</h2>
              <div className="rm-showtime-list">
                {filteredShowtimes.map(showtime => (
                  <div
                    key={showtime.id}
                    className={`rm-showtime-card ${selectedShowtime?.id === showtime.id ? 'rm-selected' : ''}`}
                    onClick={() => handleShowtimeSelect(showtime)}
                  >
                    <div className="rm-showtime-info">
                      <div className="rm-showtime-time">
                        {new Date(showtime.datetime).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="rm-showtime-date">
                        {new Date(showtime.datetime).toLocaleDateString('vi-VN')}
                      </div>
                      <div className="rm-showtime-room">
                        Phòng {showtime.roomId?.replace('room_', '')}
                      </div>
                      <div className="rm-showtime-price">
                        {showtime.price?.toLocaleString()}đ
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Room Status */}
        {selectedShowtime && roomStatus[selectedShowtime.id] && (
          <div className="rm-room-section">
            <div className="rm-room-header">
              <h2>Trạng Thái Phòng Chiếu</h2>
              <div className="rm-room-details">
                <span><strong>Phim:</strong> {selectedFilm.nameFilm}</span>
                <span><strong>Giờ chiếu:</strong> {new Date(selectedShowtime.datetime).toLocaleString('vi-VN')}</span>
                <span><strong>Phòng:</strong> {selectedShowtime.roomId?.replace('room_', '')}</span>
              </div>
            </div>

            {/* Statistics */}
            <div className="rm-stats">
              <div className="rm-stat-card">
                <div className="rm-stat-value">{roomStatus[selectedShowtime.id].statistics.totalSeats}</div>
                <div className="rm-stat-label">Tổng số ghế</div>
              </div>
              <div className="rm-stat-card">
                <div className="rm-stat-value rm-available">{roomStatus[selectedShowtime.id].statistics.availableSeats}</div>
                <div className="rm-stat-label">Ghế trống</div>
              </div>
              <div className="rm-stat-card">
                <div className="rm-stat-value rm-booked">{roomStatus[selectedShowtime.id].statistics.bookedSeats}</div>
                <div className="rm-stat-label">Ghế đã đặt</div>
              </div>
              <div className="rm-stat-card">
                <div className="rm-stat-value">{roomStatus[selectedShowtime.id].statistics.occupancyRate}%</div>
                <div className="rm-stat-label">Tỷ lệ lấp đầy</div>
              </div>
            </div>

            {/* Seat Layout */}
            <div className="rm-seat-layout">
              <div className="rm-screen-section">
                <div className="rm-screen-label">MÀN HÌNH</div>
                <div className="rm-screen"></div>
              </div>

              <div className="rm-seat-grid">
                {roomStatus[selectedShowtime.id].seatLayout.map(seat => (
                  <div
                    key={seat.id}
                    className={`rm-seat rm-${seat.type} ${seat.isBooked ? 'rm-booked' : 'rm-available'}`}
                    title={`${seat.id} - ${seat.type === 'vip' ? 'VIP' : seat.type === 'couple' ? 'Đôi' : 'Thường'} - ${seat.isBooked ? 'Đã đặt' : 'Còn trống'}`}
                  >
                    <span className="rm-seat-number">{seat.number}</span>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="rm-legend">
                <div className="rm-legend-item">
                  <div className="rm-example rm-available"></div>
                  <span>Ghế trống</span>
                </div>
                <div className="rm-legend-item">
                  <div className="rm-example rm-booked"></div>
                  <span>Ghế đã đặt</span>
                </div>
                <div className="rm-legend-item">
                  <div className="rm-example rm-vip"></div>
                  <span>Ghế VIP</span>
                </div>
                <div className="rm-legend-item">
                  <div className="rm-example rm-couple"></div>
                  <span>Ghế đôi</span>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="rm-booking-section">
              <h3>Chi tiết đặt vé</h3>
              <div className="rm-booking-list">
                {bookings
                  .filter(booking => booking.showtimeId === selectedShowtime.id)
                  .map(booking => (
                    <div key={booking.id} className="rm-booking-item">
                      <div className="rm-booking-header">
                        <span className="rm-booking-id">Mã: {booking.id}</span>
                        <span className="rm-booking-time">
                          {new Date(booking.bookingTime).toLocaleString('vi-VN')}
                        </span>
                      </div>
                      <div className="rm-booking-seats">Ghế: {booking.seats.join(', ')}</div>
                      <div className="rm-booking-total">Tổng: {booking.totalAmount?.toLocaleString()}đ</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Overview */}
        <div className="rm-overview">
          <h2>Tổng quan hôm nay</h2>
          <div className="rm-overview-cards">
            <div className="rm-overview-card">
              <h3>Tổng số phim</h3>
              <div className="rm-overview-value">{films.length}</div>
            </div>
            <div className="rm-overview-card">
              <h3>Xuất chiếu hôm nay</h3>
              <div className="rm-overview-value">
                {showtimes.filter(st => new Date(st.datetime).toDateString() === new Date().toDateString()).length}
              </div>
            </div>
            <div className="rm-overview-card">
              <h3>Doanh thu ước tính</h3>
              <div className="rm-overview-value">
                {bookings.reduce((t, b) => t + (b.totalAmount || 0), 0).toLocaleString()}đ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomManagement;
