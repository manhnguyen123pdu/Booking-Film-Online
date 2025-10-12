import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { filmAPI } from '../../services/api';
import './SeatSelectionPage.css';

const SeatSelectionPage = () => {
  const { filmId, showtimeId } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [showtime, setShowtime] = useState(null);
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredSeat, setHoveredSeat] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch showtime details
        const showtimes = await filmAPI.getShowtimes();
        const currentShowtime = showtimes.find(st => st.id === showtimeId);
        setShowtime(currentShowtime);

        // Fetch film details
        const films = await filmAPI.getFilms();
        const currentFilm = films.find(f => f.id === filmId);
        setFilm(currentFilm);

        // Fetch booked seats
        const bookings = await filmAPI.getBookingsByShowtime(showtimeId);
        console.log(bookings)
        const allBookedSeats = bookings.reduce((seats, booking) => {
          return [...seats, ...booking.seats];
        }, []);
        setBookedSeats(allBookedSeats);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filmId, showtimeId]);

  // const seatLayout = useMemo(() => {
  //   const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  //   const seats = [];
    
  //   rows.forEach(row => {
  //     for (let number = 1; number <= 12; number++) {
  //       const seatId = `${row}${number}`;
  //       const isBooked = bookedSeats.includes(seatId);
        
  //       let type = 'standard';
  //       let price = 65000;
        
  //       if (row === 'A' || row === 'B') {
  //         type = 'vip';
  //         price = 85000;
  //       } else if (row === 'G' || row === 'H') {
  //         type = 'couple';
  //         price = 120000;
  //       }
        
  //       seats.push({
  //         id: seatId,
  //         row,
  //         number,
  //         isBooked,
  //         type,
  //         price
  //       });
  //     }
  //   });
    
  //   return seats;
  // }, [bookedSeats]);

  const seatLayout = useMemo(() => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seats = [];
  
  // Lấy giá cơ bản từ showtime
  const basePrice = showtime?.price || 65000;
  
  rows.forEach(row => {
    for (let number = 1; number <= 12; number++) {
      const seatId = `${row}${number}`;
      const isBooked = bookedSeats.includes(seatId);
      
      let type = 'standard';
      let price = basePrice; // Dùng giá từ showtime
      
      // Tính hệ số nhân cho từng loại ghế
      if (row === 'A' || row === 'B') {
        type = 'vip';
        price = Math.round(basePrice * 1.3); // VIP giá cao hơn 30%
      } else if (row === 'G' || row === 'H') {
        type = 'couple';
        price = Math.round(basePrice * 1.8); // Ghế đôi giá cao hơn 80%
      }
      
      seats.push({
        id: seatId,
        row,
        number,
        isBooked,
        type,
        price
      });
    }
  });
  
  return seats;
}, [bookedSeats, showtime]); // Thêm showtime vào dependency
  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;
    
    setSelectedSeats(prev => {
      const isAlreadySelected = prev.find(s => s.id === seat.id);
      if (isAlreadySelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        // Giới hạn tối đa 8 ghế
        if (prev.length >= 8) {
          alert('Bạn chỉ có thể chọn tối đa 8 ghế!');
          return prev;
        }
        return [...prev, seat];
      }
    });
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const getSeatTypeCount = () => {
    const counts = { standard: 0, vip: 0, couple: 0 };
    selectedSeats.forEach(seat => {
      counts[seat.type]++;
    });
    return counts;
  };

  const handleContinue = () => {
    navigate('/booking/payment', {
      state: {
        film,
        showtime,
        selectedSeats,
        totalAmount: calculateTotal()
      }
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Đang tải thông tin ghế...</p>
    </div>
  );

  return (
    <div className="seat-selection-page">
      {/* Header */}
      <div className="selection-header">
  
        <div className="header-content">
          <h1>Chọn Ghế Ngồi</h1>
          <div className="movie-info">
            <h2>{film?.nameFilm}</h2>
            <div className="showtime-details">
              <span className="detail-item">
                <span className="icon">📅</span>
                {showtime && new Date(showtime.datetime).toLocaleDateString('vi-VN')}
              </span>
              <span className="detail-item">
                <span className="icon">🕒</span>
                {showtime && new Date(showtime.datetime).toLocaleTimeString('vi-VN', { 
                  hour: '2-digit', minute: '2-digit' 
                })}
              </span>
              <span className="detail-item">
                <span className="icon">🎬</span>
                Phòng {showtime?.roomId?.replace('room_', '')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="selection-content">
        {/* Cinema Layout */}
        <div className="cinema-layout">
          <div className="screen-section">
            <div className="screen-label">MÀN HÌNH</div>
            <div className="screen"></div>
          </div>

          {/* Seat Grid */}
          <div className="seat-grid-container">
            {/* <div className="row-labels">
              {[...new Set(seatLayout.map(seat => seat.row))].map(row => (
                <div key={row} className="row-label">{row}</div>
              ))}
            </div> */}
            
            <div className="seat-grid">
              {seatLayout.map(seat => (
                <div
                  key={seat.id}
                  className={`seat ${seat.type} ${
                    selectedSeats.find(s => s.id === seat.id) ? 'selected' : ''
                  } ${seat.isBooked ? 'booked' : ''} ${
                    hoveredSeat === seat.id ? 'hovered' : ''
                  }`}
                  onClick={() => handleSeatClick(seat)}
                  onMouseEnter={() => setHoveredSeat(seat.id)}
                  onMouseLeave={() => setHoveredSeat(null)}
                  title={`${seat.id} - ${seat.type === 'vip' ? 'VIP' : seat.type === 'couple' ? 'Đôi' : 'Thường'} - ${seat.price.toLocaleString()}đ`}
                >
                  <span className="seat-number">{seat.number}</span>
                  {hoveredSeat === seat.id && !seat.isBooked && (
                    <div className="seat-tooltip">
                      {seat.id} - {seat.type === 'vip' ? 'VIP' : seat.type === 'couple' ? 'Đôi' : 'Thường'}
                    </div>
                  )}
                </div>
              ))}
            </div>

           
          </div>

          {/* Seat Legend */}
          <div className="seat-legend">
            <div className="legend-item">
              <div className="seat-example available"></div>
              <span>Có thể chọn</span>
            </div>
            <div className="legend-item">
              <div className="seat-example selected"></div>
              <span>Đã chọn</span>
            </div>
            <div className="legend-item">
              <div className="seat-example booked"></div>
              <span>Đã đặt</span>
            </div>
            <div className="legend-item">
              <div className="seat-example vip"></div>
              <span>Ghế VIP</span>
            </div>
            <div className="legend-item">
              <div className="seat-example couple"></div>
              <span>Ghế đôi</span>
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        <div className="selection-summary">
          <div className="summary-card">
            <h3>Thông Tin Đặt Vé</h3>
            
            <div className="selected-seats-list">
              <h4>Ghế Đã Chọn ({selectedSeats.length})</h4>
              {selectedSeats.length > 0 ? (
                <div className="seats-display">
                  {selectedSeats.map(seat => (
                    <div key={seat.id} className="selected-seat-item">
                      <span className="seat-id">{seat.id}</span>
                      <span className="seat-type">
                        {seat.type === 'vip' ? 'VIP' : seat.type === 'couple' ? 'Đôi' : 'Thường'}
                      </span>
                      <span className="seat-price">{seat.price.toLocaleString()}đ</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-seats">Chưa chọn ghế nào</p>
              )}
            </div>

            <div className="price-breakdown">
              <div className="price-item">
                <span>Ghế thường ({getSeatTypeCount().standard})</span>
                <span>{(getSeatTypeCount().standard * 65000).toLocaleString()}đ</span>
              </div>
              <div className="price-item">
                <span>Ghế VIP ({getSeatTypeCount().vip})</span>
                <span>{(getSeatTypeCount().vip * 85000).toLocaleString()}đ</span>
              </div>
              <div className="price-item">
                <span>Ghế đôi ({getSeatTypeCount().couple})</span>
                <span>{(getSeatTypeCount().couple * 120000).toLocaleString()}đ</span>
              </div>
            </div>

            <div className="total-section">
              <div className="total-item">
                <strong>Tổng cộng:</strong>
                <strong className="total-price">{calculateTotal().toLocaleString()}đ</strong>
              </div>
            </div>

            <button 
              className={`continue-btn ${selectedSeats.length === 0 ? 'disabled' : ''}`}
              onClick={handleContinue}
              disabled={selectedSeats.length === 0}
            >
              <span className="btn-icon">🎫</span>
              Tiếp Tục Thanh Toán
              <span className="seat-count">({selectedSeats.length} ghế)</span>
            </button>

            <div className="booking-tips">
              <p>💡 <strong>Mẹo:</strong> Chọn tối đa 8 ghế. Ghế VIP và ghế đôi có view tốt nhất!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;