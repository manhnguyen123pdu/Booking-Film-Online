import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { fetchFilms } from '../../redux/slices/filmsSlice';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import '../HomePage/HomePage.css'

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: films, loading } = useSelector(state => state.films);
  const { user } = useSelector(state => state.auth);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    dispatch(fetchFilms());
  }, [dispatch]);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilmClick = (filmId) => {
    navigate(`/film/${filmId}`);
  };

  const handleBookTicket = (filmId, e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${filmId}`);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (loading) return <div className="loading">Đang tải phim...</div>;

  return (
    <div className="home-page">
      <Header />
      {/* Main Banner */}
      <section className="main-banner">
        <div className="banner-content">
          <div className="banner-text">
            <h1 className="banner-title">TRẢI NGHIỆM ĐIỆN ẢNH ĐẲNG CẤP</h1>
            <p className="banner-subtitle">Công nghệ hình ảnh 4K • Âm thanh Dolby Atmos • Ghế ngồi cao cấp</p>
            <div className="banner-features">
              <span className="feature-item">🎬 Rạp chiếu phim hiện đại</span>
              <span className="feature-item">🍿 Combo bắp nước hấp dẫn</span>
              <span className="feature-item">⚡ Đặt vé nhanh chóng</span>
            </div>
            <div className="banner-actions">
              <button
                className="btn-primary"
                onClick={() => document.getElementById('now-showing').scrollIntoView({ behavior: 'smooth' })}
              >
                Đặt Vé Ngay
              </button>
              <button className="btn-secondary">
                Xem Lịch Chiếu
              </button>
            </div>
          </div>
          <div className="banner-visual">
            <div className="floating-elements">
              <div className="floating-item item-1">🎭</div>
              <div className="floating-item item-2">🌟</div>
              <div className="floating-item item-3">🎪</div>
            </div>
          </div>
        </div>
        <div className="banner-overlay"></div>
      </section>
      {/* Events Section - Clean Design */}
      <section className="events-clean">
        <div className="container">
          <div className="section-header-clean">
            <h2>Sự Kiện & Liên Hoan Phim</h2>
            <p>Khám phá những trải nghiệm điện ảnh đặc biệt</p>
          </div>

          <div className="events-clean-grid">
            <div className="event-clean-card">
              <div className="event-icon">🎬</div>
              <h3>Liên Hoan Phim Quốc Tế</h3>
              <p className="event-date">15 - 20 Tháng 12, 2024</p>
              <p className="event-desc">50+ phim đặc sắc từ khắp nơi </p>
              <button className="btn-clean watch-btn">
                Watch Flow
              </button>
            </div>

            <div className="event-clean-card highlight">
              <div className="event-icon">🏆</div>
              <h3>Film Awards 2024</h3>
              <p className="event-date">22 Tháng 12, 2024</p>
              <p className="event-desc">Đêm trao giải điện ảnh lớn nhất năm</p>
              <button className="btn-clean ticket-btn">
                Get Ticket
              </button>
            </div>

            <div className="event-clean-card">
              <div className="event-icon">😂</div>
              <h3>Comedy TV Shows</h3>
              <p className="event-date">Hàng Tuần</p>
              <p className="event-desc">Chuỗi phim hài đặc sắc mỗi cuối tuần</p>
              <button className="btn-clean comedy-btn">
                Xem Ngay
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Films Section - Dạng Danh Sách Đơn Giản */}
      <section id="now-showing" className="films-section">
        <div className="container">
          <h2 className="section-title">Phim Đang Chiếu</h2>
          <div className="films-list-simple">
            {films.map(film => (
              <div
                key={film.id}
                className="film-item-simple"
                onClick={() => handleFilmClick(film.id)}
              >
                <img src={film.img[0]} alt={film.nameFilm} className="film-image-simple" />
                <div className="film-info-simple">
                  <h3>{film.nameFilm}</h3>
                  <p className="category">{film.infoFilm.category.join(', ')}</p>
                  <div className="rating">
                    <span>IMDb: {film.ratedView.imdb}</span>
                    <span>User: {film.ratedView.user}</span>
                  </div>
                  <button
                    className="book-btn-simple"
                    onClick={(e) => handleBookTicket(film.id, e)}
                  >
                    {user ? 'Đặt Vé' : 'Đăng nhập để đặt vé'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
 
      {/* Feedbacks Section */}
      <section className="feedbacks-section">
        <div className="container">
          <div className="feedbacks-header">
            <span className="section-label">Đánh Giá Từ Khách Hàng</span>
            <h2 className="section-title">Mọi Người Nói Gì Về Chúng Tôi?</h2>
            <p className="section-description">
              Chúng tôi luôn lắng nghe và cải thiện dịch vụ dựa trên những phản hồi quý báu từ khách hàng.
            </p>
          </div>

          <div className="feedback-card">
            <div className="feedback-content">
              <p className="feedback-text">
                "Dịch vụ đặt vé rất tiện lợi và nhanh chóng. Tôi có thể dễ dàng chọn chỗ ngồi
                và thanh toán online mà không gặp bất kỳ khó khăn nào. Rạp chiếu phim sạch sẽ,
                âm thanh hình ảnh chất lượng cao."
              </p>

              <div className="customer-info">
                <h4 className="customer-name">Nguyễn Văn An</h4>
                <span className="customer-role">Khách hàng thân thiết</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer Đơn Giản */}
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;