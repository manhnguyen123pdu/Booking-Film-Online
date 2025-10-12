import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilmDetail } from '../../redux/slices/filmsSlice';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import './ShowtimePage.css';

const ShowtimePage = () => {
  const { filmId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentFilm, showtimes, loading } = useSelector(state => state.films);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCinema, setSelectedCinema] = useState('all');

  useEffect(() => {
    if (filmId) {
      dispatch(fetchFilmDetail(filmId));
    }
  }, [filmId, dispatch]);

  // Lấy danh sách các rạp duy nhất
  const cinemas = useMemo(() => {
    const uniqueCinemas = [...new Set(showtimes.map(st => st.cinema))];
    return uniqueCinemas;
  }, [showtimes]);

  // Lấy danh sách các ngày duy nhất
  const availableDates = useMemo(() => {
    const dates = [...new Set(showtimes.map(st => format(parseISO(st.datetime), 'yyyy-MM-dd')))];
    return dates.sort();
  }, [showtimes]);

  // Nhóm suất chiếu theo ngày và rạp
  const showtimesByDateAndCinema = useMemo(() => {
    const grouped = {};

    availableDates.forEach(date => {
      grouped[date] = {};
      cinemas.forEach(cinema => {
        const cinemaShowtimes = showtimes.filter(st =>
          format(parseISO(st.datetime), 'yyyy-MM-dd') === date &&
          st.cinema === cinema
        );
        if (cinemaShowtimes.length > 0) {
          grouped[date][cinema] = cinemaShowtimes.sort((a, b) =>
            new Date(a.datetime) - new Date(b.datetime)
          );
        }
      });
    });

    return grouped;
  }, [showtimes, availableDates, cinemas]);

  // Tự động chọn ngày đầu tiên
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates, selectedDate]);

  const handleSelectShowtime = (showtime) => {
    navigate(`/booking/${filmId}/showtime/${showtime.id}`);
  };

  const getDateDisplay = (dateStr) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return 'Hôm nay';
    if (isTomorrow(date)) return 'Ngày mai';
    return format(date, 'dd/MM/yyyy');
  };

  const getCinemaInfo = (cinemaName) => {
    const cinemaInfo = {
      'cgv': { name: 'CGV Cinema', color: '#e50914', icon: '🎬' },
      'lotte': { name: 'Lotte Cinema', color: '#00a8ff', icon: '🌟' },
      'bhd': { name: 'BHD Star', color: '#9c27b0', icon: '⭐' },
      'galaxy': { name: 'Galaxy Cinema', color: '#ff9800', icon: '🌌' }
    };
    return cinemaInfo[cinemaName] || { name: cinemaName, color: '#666', icon: '🎭' };
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Đang tải lịch chiếu...</p>
    </div>
  );

  if (!currentFilm) return (
    <div className="error-screen">
      <h2>Không tìm thấy phim</h2>
      <button onClick={() => navigate('/')} className="back-home-btn">
        Về trang chủ
      </button>
    </div>
  );

  return (
    <div className="showtime-page">
      {/* Header */}
      <div className="showtime-header">
        <div className="header-content">
          <h1>Chọn Suất Chiếu</h1>
          <div className="movie-info">
            <img src={currentFilm.img[0]} alt={currentFilm.nameFilm} className="movie-poster" />
            <div className="movie-details">
              <h2>{currentFilm.nameFilm}</h2>
              <div className="movie-meta">
                <span className="rating-badge imdb">IMDb: {currentFilm.ratedView?.imdb || 'N/A'}</span>
                <span className="rating-badge user">⭐ {currentFilm.ratedView?.user || 'N/A'}</span>
                <span className="duration">{currentFilm.infoFilm?.duration || '120'} phút</span>
              </div>
              <div className="film-genres">
                {currentFilm.infoFilm?.category?.map((genre, index) => (
                  <span key={index} className="genre-tag">{genre}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="showtime-content">
        {/* Filters */}
        <div className="filters-section">
          <div className="date-filter">
            <h3>📅 Chọn ngày</h3>
            <div className="date-buttons">
              {availableDates.map(date => (
                <button
                  key={date}
                  className={`date-btn ${selectedDate === date ? 'active' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  {getDateDisplay(date)}
                </button>
              ))}
            </div>
          </div>

          <div className="cinema-filter">
            <h3>🎭 Chọn rạp</h3>
            <div className="cinema-buttons">
              <button
                className={`cinema-btn ${selectedCinema === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCinema('all')}
              >
                Tất cả rạp
              </button>
              {cinemas.map(cinema => {
                const info = getCinemaInfo(cinema);
                return (
                  <button
                    key={cinema}
                    className={`cinema-btn ${selectedCinema === cinema ? 'active' : ''}`}
                    onClick={() => setSelectedCinema(cinema)}
                    style={{ '--cinema-color': info.color }}
                  >
                    <span className="cinema-icon">{info.icon}</span>
                    {info.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Showtimes Grid */}
        <div className="showtimes-grid">
          {selectedDate && showtimesByDateAndCinema[selectedDate] && (
            Object.entries(showtimesByDateAndCinema[selectedDate])
              .filter(([cinema]) => selectedCinema === 'all' || cinema === selectedCinema)
              .map(([cinema, cinemaShowtimes]) => {
                const cinemaInfo = getCinemaInfo(cinema);

                return (
                  <div key={cinema} className="cinema-section">
                    <div className="cinema-header">
                      <div className="cinema-info">
                        <span
                          className="cinema-icon"
                          style={{ color: cinemaInfo.color }}
                        >
                          {cinemaInfo.icon}
                        </span>
                   
                      </div>
                      <div className="cinema-features">
                        <span className="feature-tag">🎦 IMAX</span>
                        <span className="feature-tag">🔊 Dolby Atmos</span>
                        <span className="feature-tag">🪑 Ghế đôi</span>
                      </div>
                    </div>

                    <div className="showtime-slots">
                      {cinemaShowtimes.map(showtime => (
                        <div
                          key={showtime.id}
                          className="showtime-card"
                          onClick={() => handleSelectShowtime(showtime)}
                        >
                          <div>
                            <div className="time-section">
                              <div className="showtime-time">
                                {format(parseISO(showtime.datetime), 'HH:mm')}
                              </div>
                              <div className="showtime-end">
                                ~{format(parseISO(showtime.datetime).getTime() + (currentFilm.infoFilm?.duration || 120) * 60000, 'HH:mm')}
                              </div>
                            </div>

                            <div className="room-section">
                              <span className="room-name">Phòng {showtime.roomId.replace('room_', '')}</span>
                              <span className="room-type">{showtime.roomType || '2D'}</span>
                            </div>

                          </div>
                          <div>
                            <div className="price-section">
                              <span className="normal-price">
                                {showtime.price.toLocaleString()}đ
                              </span>
                            </div>

                            <div className="action-section">
                              <button className="select-btn">
                                Chọn ghế
                              </button>
                            </div>
                          </div>


                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
          )}

          {selectedDate && (!showtimesByDateAndCinema[selectedDate] ||
            Object.keys(showtimesByDateAndCinema[selectedDate]).length === 0) && (
              <div className="no-showtimes">
                <div className="no-showtimes-icon">🎬</div>
                <h3>Không có suất chiếu</h3>
                <p>Không có suất chiếu nào cho ngày đã chọn.</p>
                <button
                  className="change-date-btn"
                  onClick={() => setSelectedDate(availableDates[0])}
                >
                  Xem ngày khác
                </button>
              </div>
            )}
        </div>

        {/* Quick Tips */}
        <div className="quick-tips">
          <h3>💡 Mẹo đặt vé</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-icon">🎯</span>
              <div>
                <strong>Giờ vàng</strong>
                <p>Suất chiếu 18:00 - 20:00 thường có view đẹp nhất</p>
              </div>
            </div>
            <div className="tip-card">
              <span className="tip-icon">💰</span>
              <div>
                <strong>Tiết kiệm</strong>
                <p>Suất sớm và chiều thường có giá tốt hơn</p>
              </div>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🪑</span>
              <div>
                <strong>Ghế ngồi</strong>
                <p>Chọn ghế giữa để có trải nghiệm xem tốt nhất</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowtimePage;