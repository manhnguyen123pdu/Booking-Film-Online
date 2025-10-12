import React, { useState, useEffect } from 'react'
import { dashboardAPI } from '../services/api'
import './FilmManagement.css'

const FilmManagement = () => {
 const [films, setFilms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedFilm, setSelectedFilm] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    nameFilm: '',
    description: '',
    status: 'coming',
    img: [''],
    trailer: '',
    ratedView: { imdb: '', user: '' },
    infoFilm: {
      category: [],
      duration: '',
      director: '',
      cast: [],
      language: 'Tiếng Việt',
      subtitle: 'Tiếng Anh',
      rated: 'P',
      premiere: ''
    }
  })

  useEffect(() => {
    fetchFilms()
  }, [])

  const fetchFilms = async () => {
    try {
      setLoading(true)
      const filmsData = await dashboardAPI.getFilms()
      setFilms(filmsData)
    } catch (error) {
      console.error('Error fetching films:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredFilms = films.filter(film => {
    const matchesSearch = film.nameFilm?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         film.infoFilm?.category?.some(cat => 
                           cat.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    const matchesStatus = statusFilter === 'all' || film.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddFilm = () => {
    setFormData({
      nameFilm: '',
      description: '',
      status: 'coming',
      img: [''],
      trailer: '',
      ratedView: { imdb: '', user: '' },
      infoFilm: {
        category: [],
        duration: '',
        director: '',
        cast: [],
        language: 'Tiếng Việt',
        subtitle: 'Tiếng Anh',
        rated: 'P',
        premiere: ''
      }
    })
    setSelectedFilm(null)
    setShowModal(true)
  }

  const handleEditFilm = (film) => {
    setFormData({
      nameFilm: film.nameFilm || '',
      description: film.description || '',
      status: film.status || 'coming',
      img: film.img || [''],
      trailer: film.trailer || '',
      ratedView: {
        imdb: film.ratedView?.imdb || '',
        user: film.ratedView?.user || ''
      },
      infoFilm: {
        category: film.infoFilm?.category || [],
        duration: film.infoFilm?.duration || '',
        director: film.infoFilm?.director || '',
        cast: film.infoFilm?.cast || [],
        language: film.infoFilm?.language || 'Tiếng Việt',
        subtitle: film.infoFilm?.subtitle || 'Tiếng Anh',
        rated: film.infoFilm?.rated || 'P',
        premiere: film.infoFilm?.premiere || ''
      }
    })
    setSelectedFilm(film)
    setShowModal(true)
  }

  const handleDeleteFilm = async (filmId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      try {
        // Gọi API xóa phim
        console.log('Deleting film:', filmId)
        // await dashboardAPI.deleteFilm(filmId)
        fetchFilms() // Refresh list
      } catch (error) {
        console.error('Error deleting film:', error)
      }
    }
  }

  const toggleFilmStatus = async (filmId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'showing' ? 'coming' : 'showing'
      // Gọi API cập nhật trạng thái
      console.log('Updating film status:', filmId, newStatus)
      // await dashboardAPI.updateFilmStatus(filmId, newStatus)
      fetchFilms() // Refresh list
    } catch (error) {
      console.error('Error updating film status:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNestedInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleArrayInputChange = (section, field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: array
      }
    }))
  }
const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    // TẠO DATA THEO ĐÚNG FORMAT TRONG DB.JSON
    const filmData = {
      id: `film_${Math.random().toString(36).substr(2, 18)}`,
      nameFilm: formData.nameFilm,
      videoTrailer: formData.trailer, // Đổi trailer -> videoTrailer
      release: "5/4", // Hoặc lấy từ form
      img: formData.img,
      subImg: [""], // Thêm subImg
      ratedView: {
        imdb: formData.ratedView.imdb,
        user: formData.ratedView.user
      },
      infoFilm: {
        rating: formData.infoFilm.rated, // Đổi rated -> rating
        releaseDate: formData.infoFilm.premiere, // Đổi premiere -> releaseDate
        status: formData.status === 'showing', // Đổi status sang boolean
        cast: [], // Thêm cast array
        director: formData.infoFilm.director,
        story: formData.description, // Đổi description -> story
        country: "Âu Mỹ", // Thêm country
        time: `${formData.infoFilm.duration} phút`, // Đổi duration -> time
        category: formData.infoFilm.category
      }
    }

    if (selectedFilm) {
      // Cập nhật phim
      console.log('Updating film:', selectedFilm.id, filmData)
      // await dashboardAPI.updateFilm(selectedFilm.id, filmData)
    } else {
      // THÊM PHIM MỚI
      console.log('Adding new film:', filmData)
      await dashboardAPI.addFilm(filmData)
    }
    setShowModal(false)
    fetchFilms() // Refresh list
  } catch (error) {
    console.error('Error saving film:', error)
  }
}

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'showing': { text: 'Đang chiếu', class: 'showing' },
      'coming': { text: 'Sắp chiếu', class: 'coming' },
      'ended': { text: 'Đã kết thúc', class: 'ended' }
    }
    const config = statusConfig[status] || { text: status, class: 'coming' }
    return <span className={`status-badge ${config.class}`}>{config.text}</span>
  }

  if (loading) {
    return (
      <div className="film-management-loading">
        <div className="spinner"></div>
        <p>Đang tải danh sách phim...</p>
      </div>
    )
  }


  return (
    <div className="film-management">
      {/* Header */}
      <div className="film-management-header">
        <div className="header-content">
          <h1>🎬 Quản lý Phim</h1>
          <p>Quản lý danh sách phim và thông tin chi tiết</p>
        </div>
        <button className="add-film-btn" onClick={handleAddFilm}>
          <span className="btn-icon">➕</span>
          Thêm Phim Mới
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <div className="search-icon">🔍</div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên phim hoặc thể loại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            Tất cả
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'showing' ? 'active' : ''}`}
            onClick={() => setStatusFilter('showing')}
          >
            Đang chiếu
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'coming' ? 'active' : ''}`}
            onClick={() => setStatusFilter('coming')}
          >
            Sắp chiếu
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="film-stats">
        <div className="stat-item">
          <div className="stat-number">{films.length}</div>
          <div className="stat-label">Tổng số phim</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {films.filter(f => f.status === 'showing').length}
          </div>
          <div className="stat-label">Đang chiếu</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">
            {films.filter(f => f.status === 'coming').length}
          </div>
          <div className="stat-label">Sắp chiếu</div>
        </div>
      </div>

      {/* Films Grid */}
      <div className="films-grid">
        {filteredFilms.map(film => (
          <div key={film.id} className="film-card">
            <div className="film-image">
              <img src={film.img?.[0]} alt={film.nameFilm} />
              <div className="film-overlay">
                <div className="film-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditFilm(film)}
                    title="Chỉnh sửa"
                  >
                    ✏️
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteFilm(film.id)}
                    title="Xóa"
                  >
                    🗑️
                  </button>
                  <button 
                    className="action-btn status"
                    onClick={() => toggleFilmStatus(film.id, film.status)}
                    title="Đổi trạng thái"
                  >
                    {film.status === 'showing' ? '⏸️' : '▶️'}
                  </button>
                </div>
              </div>
              {getStatusBadge(film.status)}
            </div>
            
            <div className="film-info">
              <h3 className="film-title">{film.nameFilm}</h3>
              
              <div className="film-meta">
                <div className="meta-item">
                  <span className="meta-label">📅</span>
                  <span>{formatDate(film.infoFilm?.premiere) || 'Chưa có'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">⏱️</span>
                  <span>{film.infoFilm?.duration || 'N/A'} phút</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">⭐</span>
                  <span>{film.ratedView?.imdb || 'N/A'}</span>
                </div>
              </div>

              <div className="film-genres">
                {film.infoFilm?.category?.map((genre, index) => (
                  <span key={index} className="genre-tag">{genre}</span>
                ))}
              </div>

              <div className="film-details">
                <p className="film-description">
                  {film.description || 'Chưa có mô tả...'}
                </p>
                
                <div className="film-cast">
                  <strong>Diễn viên:</strong>{' '}
                  {film.infoFilm?.cast?.slice(0, 2).join(', ') || 'Chưa cập nhật'}
                  {film.infoFilm?.cast?.length > 2 && '...'}
                </div>
                
                <div className="film-director">
                  <strong>Đạo diễn:</strong> {film.infoFilm?.director || 'Chưa cập nhật'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredFilms.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <h3>Không tìm thấy phim</h3>
          <p>Không có phim nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
          <button className="add-film-btn" onClick={handleAddFilm}>
            Thêm phim đầu tiên
          </button>
        </div>
      )}

      {/* Film Modal (Placeholder) */}
    {showModal && (
        <div className="modal-overlay">
          <div className="modal-content film-form-modal">
            <div className="modal-header">
              <h2>{selectedFilm ? 'Chỉnh sửa Phim' : 'Thêm Phim Mới'}</h2>
              <button 
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="film-form">
              <div className="modal-body">
                <div className="form-grid">
                  {/* Basic Information */}
                  <div className="form-section">
                    <h3>Thông tin cơ bản</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Tên phim *</label>
                        <input
                          type="text"
                          name="nameFilm"
                          value={formData.nameFilm}
                          onChange={handleInputChange}
                          placeholder="Nhập tên phim"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Mô tả</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Mô tả về phim..."
                          rows="3"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Trạng thái</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                        >
                          <option value="coming">Sắp chiếu</option>
                          <option value="showing">Đang chiếu</option>
                          <option value="ended">Đã kết thúc</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Thời lượng (phút)</label>
                        <input
                          type="number"
                          value={formData.infoFilm.duration}
                          onChange={(e) => handleNestedInputChange('infoFilm', 'duration', e.target.value)}
                          placeholder="120"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Media */}
                  <div className="form-section">
                    <h3>Media</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>URL Hình ảnh</label>
                        <input
                          type="url"
                          value={formData.img[0]}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            img: [e.target.value]
                          }))}
                          placeholder="https://example.com/poster.jpg"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Trailer URL</label>
                        <input
                          type="url"
                          name="trailer"
                          value={formData.trailer}
                          onChange={handleInputChange}
                          placeholder="https://youtube.com/embed/..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ratings */}
                  <div className="form-section">
                    <h3>Đánh giá</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>IMDb Rating</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={formData.ratedView.imdb}
                          onChange={(e) => handleNestedInputChange('ratedView', 'imdb', e.target.value)}
                          placeholder="8.5"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>User Rating</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={formData.ratedView.user}
                          onChange={(e) => handleNestedInputChange('ratedView', 'user', e.target.value)}
                          placeholder="4.7"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Film Details */}
                  <div className="form-section">
                    <h3>Chi tiết phim</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Thể loại (phân cách bằng dấu phẩy)</label>
                        <input
                          type="text"
                          value={formData.infoFilm.category.join(', ')}
                          onChange={(e) => handleArrayInputChange('infoFilm', 'category', e.target.value)}
                          placeholder="Hài, Tình cảm, Hành động"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Đạo diễn</label>
                        <input
                          type="text"
                          value={formData.infoFilm.director}
                          onChange={(e) => handleNestedInputChange('infoFilm', 'director', e.target.value)}
                          placeholder="Tên đạo diễn"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Diễn viên (phân cách bằng dấu phẩy)</label>
                        <input
                          type="text"
                          value={formData.infoFilm.cast.join(', ')}
                          onChange={(e) => handleArrayInputChange('infoFilm', 'cast', e.target.value)}
                          placeholder="Diễn viên A, Diễn viên B, Diễn viên C"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Ngày công chiếu</label>
                        <input
                          type="date"
                          value={formData.infoFilm.premiere}
                          onChange={(e) => handleNestedInputChange('infoFilm', 'premiere', e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Độ tuổi</label>
                        <select
                          value={formData.infoFilm.rated}
                          onChange={(e) => handleNestedInputChange('infoFilm', 'rated', e.target.value)}
                        >
                          <option value="P">P - Mọi lứa tuổi</option>
                          <option value="K">K - Trên 13 tuổi</option>
                          <option value="T16">T16 - Trên 16 tuổi</option>
                          <option value="T18">T18 - Trên 18 tuổi</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Ngôn ngữ</label>
                        <input
                          type="text"
                          value={formData.infoFilm.language}
                          onChange={(e) => handleNestedInputChange('infoFilm', 'language', e.target.value)}
                          placeholder="Tiếng Việt"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Phụ đề</label>
                        <input
                          type="text"
                          value={formData.infoFilm.subtitle}
                          onChange={(e) => handleNestedInputChange('infoFilm', 'subtitle', e.target.value)}
                          placeholder="Tiếng Anh"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {selectedFilm ? 'Cập nhật' : 'Thêm phim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilmManagement