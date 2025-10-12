import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFilmDetail } from '../../redux/slices/filmsSlice';
import ReactPlayer from "react-player";
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import '../FilmDetailPage/FilmDetailPage.css'
const FilmDetailPage = () => {
  const { filmId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentFilm, loading } = useSelector(state => state.films);
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (filmId) {
      dispatch(fetchFilmDetail(filmId));
    }
  }, [filmId, dispatch]);

  const handleBookTicket = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${filmId}`);
  };

  const handleWatchTrailer = () => {
    // Logic để mở trailer
    alert('Mở trailer phim');
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Đang tải thông tin phim...</p>
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
    <div className="film-detail-page">
      <Header />
      {/* Hero Section với Background */}
      <section
        className="film-hero"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${currentFilm.img[0]})` }}
      >
        <div className="container">
          <div className="film-hero-content">
            <div className="film-poster-section">
              <img
                src={currentFilm.img[0]}
                alt={currentFilm.nameFilm}
                className="film-poster"
              />
              <div className="action-buttons">
                <button className="btn-primary" onClick={handleBookTicket}>
                  🎫 Đặt Vé Ngay
                </button>


                <div>
                  {/* Button trigger modal */}
                  <button type="button" className="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    ▶️ Xem Trailer
                  </button>
                  {/* Modal */}
                  <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title fs-5" id="exampleModalLabel">{currentFilm.nameFilm}</h1>
                        </div>
                        <div className="modal-body">
                          <iframe width="100%" height="400" src={currentFilm.videoTrailer.replace('youtu.be/', 'www.youtube.com/embed/').replace('watch?v=', 'embed/')} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn " data-bs-dismiss="modal">Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div className="film-main-info">
              <div className="film-header">
                <h1 className="film-title">{currentFilm.nameFilm}</h1>
                <div className="film-meta">
                  <span className="rating-badge imdb">IMDb: {currentFilm.ratedView?.imdb || 'N/A'}</span>
                  <span className="rating-badge user">⭐ {currentFilm.ratedView?.user || 'N/A'}</span>
                  <span className="duration">{currentFilm.infoFilm?.duration || '120'} phút</span>
                </div>
              </div>

              <div className="film-genres">
                {currentFilm.infoFilm?.category?.map((genre, index) => (
                  <span key={index} className="genre-tag">{genre}</span>
                ))}
              </div>

              <p className="film-description">
                {currentFilm.infoFilm?.story || 'Nội dung phim đang được cập nhật...'}
              </p>

              <div className="film-details-grid">
                <div className="detail-item">
                  <span className="label">Đạo diễn:</span>
                  <span className="value">{currentFilm.infoFilm?.director || 'Đang cập nhật'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Ngôn ngữ:</span>
                  <span className="value">{currentFilm.infoFilm?.language || 'Tiếng Anh'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Khởi chiếu:</span>
                  <span className="value">{currentFilm.infoFilm?.releaseDate || 'Đang cập nhật'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Độ tuổi:</span>
                  <span className="value age-restriction">P - PHIM DÀNH CHO MỌI LỨA TUỔI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="film-tabs-section">
        <div className="container">
          <div className="tabs-navigation">
            <button
              className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              Thông Tin
            </button>
            <button
              className={`tab-btn ${activeTab === 'cast' ? 'active' : ''}`}
              onClick={() => setActiveTab('cast')}
            >
              Diễn Viên
            </button>

            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Đánh Giá
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'info' && (
              <div className="info-tab">
                <div className="info-grid">
                  <div className="info-card">
                    <h3>Thông Tin Chi Tiết</h3>
                    <div className="info-list">
                      <div className="info-item">
                        <strong>Đạo diễn:</strong>
                        <span>{currentFilm.infoFilm?.director || 'Đang cập nhật'}</span>
                      </div>
                      <div className="info-item">
                        <strong>Diễn viên:</strong>
                        <span>
                          {currentFilm.infoFilm?.cast?.slice(0, 3).map(actor => actor.name).join(', ') || 'Đang cập nhật'}
                        </span>
                      </div>
                      <div className="info-item">
                        <strong>Thể loại:</strong>
                        <span>{currentFilm.infoFilm?.category?.join(', ') || 'Đang cập nhật'}</span>
                      </div>
                      <div className="info-item">
                        <strong>Thời lượng:</strong>
                        <span>{currentFilm.infoFilm?.duration || '120'} phút</span>
                      </div>
                      <div className="info-item">
                        <strong>Ngôn ngữ:</strong>
                        <span>{currentFilm.infoFilm?.language || 'Tiếng Anh'}</span>
                      </div>
                      <div className="info-item">
                        <strong>Khởi chiếu:</strong>
                        <span>{currentFilm.infoFilm?.releaseDate || 'Đang cập nhật'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="story-card">
                    <h3>Câu Chuyện</h3>
                    <p className="story-text">
                      {currentFilm.infoFilm?.story || 'Nội dung phim đang được cập nhật...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cast' && (
              <div className="cast-tab">
                <h3>Dàn Diễn Viên</h3>
                <div className="cast-grid">
                  {currentFilm.infoFilm?.cast?.map((actor, index) => (
                    <div key={index} className="cast-card">
                      <div className="actor-photo">
                        <img
                          src={actor.img || '/default-avatar.jpg'}
                          alt={actor.name}
                          onError={(e) => {
                            e.target.src = '/default-avatar.jpg';
                          }}
                        />
                      </div>
                      <div className="actor-info">
                        <h4 className="actor-name">{actor.name}</h4>
                        <p className="actor-role">{actor.role}</p>
                      </div>
                    </div>
                  )) || <p>Thông tin diễn viên đang được cập nhật...</p>}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-tab">
                <h3>Đánh Giá Từ Khán Giả</h3>
                <div className="reviews-list">
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer">
                        <strong>Nguyễn Văn A</strong>
                        <div className="rating">⭐️⭐️⭐️⭐️⭐️</div>
                      </div>
                      <span className="review-date">2 ngày trước</span>
                    </div>
                    <p className="review-text">
                      Phim rất hay, diễn viên diễn xuất tốt, cốt truyện hấp dẫn từ đầu đến cuối.
                    </p>
                  </div>
                  <div className="review-card">
                    <div className="review-header">
                      <div className="reviewer">
                        <strong>Trần Thị B</strong>
                        <div className="rating">⭐️⭐️⭐️⭐️</div>
                      </div>
                      <span className="review-date">1 tuần trước</span>
                    </div>
                    <p className="review-text">
                      Hiệu ứng hình ảnh đẹp, âm thanh sống động. Đáng xem!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
      {/* Floating Action Button */}
      <div className="floating-action">
        <button className="fab-book" onClick={handleBookTicket}>
          🎫 Đặt Vé
        </button>
      </div>
    </div>
  );
};

export default FilmDetailPage;