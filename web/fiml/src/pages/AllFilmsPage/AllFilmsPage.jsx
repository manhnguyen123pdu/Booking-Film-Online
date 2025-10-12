import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFilms } from '../../redux/slices/filmsSlice';
import './AllFilmsPage.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const AllFilmsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: films, loading } = useSelector(state => state.films);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchFilms());
  }, [dispatch]);

  // Filter và sort films
  const filteredAndSortedFilms = films
    .filter(film => {
      // Filter theo thể loại
      if (filter !== 'all' && !film.infoFilm?.category?.includes(filter)) {
        return false;
      }
      // Filter theo search term
      if (searchTerm && !film.nameFilm.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.nameFilm.localeCompare(b.nameFilm);
        case 'rating':
          return (b.ratedView?.user || 0) - (a.ratedView?.user || 0);
        case 'imdb':
          return (b.ratedView?.imdb || 0) - (a.ratedView?.imdb || 0);
        case 'newest':
          return new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0);
        default:
          return 0;
      }
    });

  const handleFilmClick = (filmId) => {
    navigate(`/film/${filmId}`);
  };

  const handleBookTicket = (filmId, e) => {
    e.stopPropagation();
    navigate(`/film/${filmId}#showtimes`);
  };

  // Lấy tất cả thể loại duy nhất
  const allCategories = [...new Set(films.flatMap(film => film.infoFilm?.category || []))];

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Đang tải danh sách phim...</p>
    </div>
  );

  return (
    <div className="all-films-page">
      {/* Header */}
      <Header/>
      <div className="films-header">
        <div className="container">
          <h1>🎬 Tất Cả Phim</h1>
          <p>Khám phá bộ sưu tập phim đa dạng của chúng tôi</p>
        </div>
      </div>

      {/* Filters và Search */}
      <div className="filters-section">
        <div className="container">
          <div className="filters-grid">
            {/* Search */}
            <div className="search-box">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm phim..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label>Thể loại:</label>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả thể loại</option>
                {allCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="filter-group">
              <label>Sắp xếp:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">Theo tên A-Z</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="imdb">IMDb cao nhất</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          <div className="active-filters">
            {filter !== 'all' && (
              <span className="active-filter">
                Thể loại: {filter}
                <button onClick={() => setFilter('all')}>✕</button>
              </span>
            )}
            {searchTerm && (
              <span className="active-filter">
                Tìm: "{searchTerm}"
                <button onClick={() => setSearchTerm('')}>✕</button>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Films Grid */}
      <div className="films-section">
        <div className="container">
          <div className="films-stats">
            <span>Hiển thị {filteredAndSortedFilms.length} trên tổng {films.length} phim</span>
          </div>

          {filteredAndSortedFilms.length === 0 ? (
            <div className="no-films">
              <div className="no-films-icon">🎭</div>
              <h3>Không tìm thấy phim phù hợp</h3>
              <p>Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
              <button 
                className="reset-filters"
                onClick={() => {
                  setFilter('all');
                  setSearchTerm('');
                }}
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <div className="films-grid">
              {filteredAndSortedFilms.map(film => (
                <div 
                  key={film.id} 
                  className="film-card"
                  onClick={() => handleFilmClick(film.id)}
                >
                  <div className="film-poster">
                    <img src={film.img[0]} alt={film.nameFilm} />
                    <div className="film-overlay">
                      <button 
                        className="quick-book-btn"
                        onClick={(e) => handleBookTicket(film.id, e)}
                      >
                        Đặt Vé Ngay
                      </button>
                    </div>
                    {film.status === 'coming' && (
                      <div className="coming-soon-badge">Sắp Chiếu</div>
                    )}
                  </div>
                  
                  <div className="film-info">
                    <h3 className="film-title">{film.nameFilm}</h3>
                    
                    <div className="film-categories">
                      {film.infoFilm?.category?.slice(0, 3).map((category, index) => (
                        <span key={index} className="category-tag">{category}</span>
                      ))}
                    </div>

                    <div className="film-ratings">
                      <div className="rating-item">
                        <span className="rating-label">IMDb:</span>
                        <span className="rating-value">{film.ratedView?.imdb || 'N/A'}</span>
                      </div>
                      <div className="rating-item">
                        <span className="rating-label">User:</span>
                        <span className="rating-value">⭐ {film.ratedView?.user || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="film-meta">
                      <span className="duration">{film.infoFilm?.duration || '120'} phút</span>
                      <span className="language">{film.infoFilm?.language || 'Tiếng Anh'}</span>
                    </div>

                    <p className="film-description">
                      {film.infoFilm?.story?.substring(0, 100) || 'Nội dung đang được cập nhật...'}...
                    </p>

                    <div className="film-actions">
                      <button 
                        className="detail-btn"
                        onClick={() => handleFilmClick(film.id)}
                      >
                        Xem Chi Tiết
                      </button>
                      <button 
                        className="book-btn"
                        onClick={(e) => handleBookTicket(film.id, e)}
                      >
                        Đặt Vé
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Stats */}
          <div className="films-quick-stats">
            <div className="stat-card">
              <span className="stat-number">{films.length}</span>
              <span className="stat-label">Tổng số phim</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {films.filter(f => f.status === 'showing').length}
              </span>
              <span className="stat-label">Đang chiếu</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {films.filter(f => f.status === 'coming').length}
              </span>
              <span className="stat-label">Sắp chiếu</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {allCategories.length}
              </span>
              <span className="stat-label">Thể loại</span>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default AllFilmsPage;