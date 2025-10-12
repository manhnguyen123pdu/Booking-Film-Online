import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { filmAPI } from '../../services/api';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFilms: 0,
    totalBookings: 0,
    totalRevenue: 0,
    todayBookings: 0,
    activeUsers: 0
  });
  
  const [recentBookings, setRecentBookings] = useState([]);
  const [popularFilms, setPopularFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [user, navigate, timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data
      const [users, films, bookings] = await Promise.all([
        filmAPI.getUsers(),
        filmAPI.getFilms(),
        filmAPI.getBookings()
      ]);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = bookings.filter(booking => 
        booking.createdAt?.includes(today)
      );

      const totalRevenue = bookings.reduce((sum, booking) => 
        sum + (booking.totalAmount || 0), 0
      );

      // Get popular films (films with most bookings)
      const filmBookingsCount = {};
      bookings.forEach(booking => {
        filmBookingsCount[booking.filmId] = (filmBookingsCount[booking.filmId] || 0) + 1;
      });

      const popularFilmsList = films
        .map(film => ({
          ...film,
          bookingCount: filmBookingsCount[film.id] || 0
        }))
        .sort((a, b) => b.bookingCount - a.bookingCount)
        .slice(0, 5);

      // Get recent bookings
      const recentBookingsList = bookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);

      setStats({
        totalUsers: users.length,
        totalFilms: films.length,
        totalBookings: bookings.length,
        totalRevenue,
        todayBookings: todayBookings.length,
        activeUsers: users.filter(u => u.lastLogin).length
      });

      setRecentBookings(recentBookingsList);
      setPopularFilms(popularFilmsList);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'confirmed': { text: 'Đã xác nhận', class: 'confirmed' },
      'completed': { text: 'Hoàn thành', class: 'completed' },
      'cancelled': { text: 'Đã hủy', class: 'cancelled' },
      'pending': { text: 'Chờ xử lý', class: 'pending' }
    };
    
    const config = statusConfig[status] || { text: status, class: 'pending' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Đang tải dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Dashboard</h1>
            <p>Chào mừng trở lại, {user?.fullName || 'Admin'}! 👋</p>
          </div>
          <div className="header-actions">
            <div className="time-filter">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="time-select"
              >
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
                <option value="year">Năm nay</option>
              </select>
            </div>
            <button className="refresh-btn" onClick={fetchDashboardData}>
              🔄 Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Doanh thu</h3>
            <div className="stat-value">{formatCurrency(stats.totalRevenue)}</div>
            <div className="stat-change positive">+12.5% so với tuần trước</div>
          </div>
        </div>

        <div className="stat-card bookings">
          <div className="stat-icon">🎫</div>
          <div className="stat-info">
            <h3>Tổng vé đặt</h3>
            <div className="stat-value">{stats.totalBookings.toLocaleString()}</div>
            <div className="stat-change">
              <strong>{stats.todayBookings}</strong> vé hôm nay
            </div>
          </div>
        </div>

        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Người dùng</h3>
            <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
            <div className="stat-change">
              <strong>{stats.activeUsers}</strong> đang hoạt động
            </div>
          </div>
        </div>

        <div className="stat-card films">
          <div className="stat-icon">🎬</div>
          <div className="stat-info">
            <h3>Phim</h3>
            <div className="stat-value">{stats.totalFilms}</div>
            <div className="stat-change positive">+3 phim mới</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Recent Bookings */}
        <div className="content-section">
          <div className="section-header">
            <h2>Đơn đặt vé gần đây</h2>
            <button className="view-all-btn" onClick={() => navigate('/admin/bookings')}>
              Xem tất cả
            </button>
          </div>
          <div className="bookings-table">
            <div className="table-header">
              <div>Mã đơn</div>
              <div>Phim</div>
              <div>Khách hàng</div>
              <div>Thời gian</div>
              <div>Số lượng</div>
              <div>Tổng tiền</div>
              <div>Trạng thái</div>
            </div>
            <div className="table-body">
              {recentBookings.map(booking => (
                <div key={booking.id} className="table-row">
                  <div className="booking-id">#{booking.id.slice(-6)}</div>
                  <div className="film-name">{booking.filmName}</div>
                  <div className="customer">
                    {booking.customerInfo?.fullName || 'N/A'}
                  </div>
                  <div className="booking-time">
                    {formatDate(booking.createdAt)}
                  </div>
                  <div className="seat-count">
                    {booking.seats?.length || 0} ghế
                  </div>
                  <div className="booking-amount">
                    {formatCurrency(booking.totalAmount || 0)}
                  </div>
                  <div className="booking-status">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Films & Quick Actions */}
        <div className="side-content">
          {/* Popular Films */}
          <div className="content-section">
            <div className="section-header">
              <h2>Phim phổ biến</h2>
            </div>
            <div className="popular-films">
              {popularFilms.map((film, index) => (
                <div key={film.id} className="popular-film-card">
                  <div className="film-rank">#{index + 1}</div>
                  <img src={film.img?.[0]} alt={film.nameFilm} className="film-thumb" />
                  <div className="film-info">
                    <h4>{film.nameFilm}</h4>
                    <p>{film.bookingCount} lượt đặt</p>
                  </div>
                  <div className="film-rating">
                    ⭐ {film.ratedView?.imdb || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="content-section">
            <div className="section-header">
              <h2>Thao tác nhanh</h2>
            </div>
            <div className="quick-actions">
              <button className="action-btn primary" onClick={() => navigate('/admin/films/add')}>
                🎬 Thêm phim mới
              </button>
              <button className="action-btn secondary" onClick={() => navigate('/admin/showtimes')}>
                ⏰ Quản lý suất chiếu
              </button>
              <button className="action-btn success" onClick={() => navigate('/admin/users')}>
                👥 Quản lý người dùng
              </button>
              <button className="action-btn warning" onClick={() => navigate('/admin/reports')}>
                📊 Xem báo cáo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Doanh thu theo tháng</h3>
            <span className="chart-period">2024</span>
          </div>
          <div className="chart-placeholder">
            <div className="chart-mock">
              <div className="chart-bars">
                {[65, 80, 75, 90, 85, 95, 110, 105, 120, 115, 130, 140].map((height, index) => (
                  <div 
                    key={index} 
                    className="chart-bar"
                    style={{ height: `${height}px` }}
                  ></div>
                ))}
              </div>
              <div className="chart-labels">
                {['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'].map(label => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Phân loại đơn hàng</h3>
          </div>
          <div className="chart-placeholder">
            <div className="pie-chart-mock">
              <div className="pie-segment confirmed"></div>
              <div className="pie-segment completed"></div>
              <div className="pie-segment cancelled"></div>
              <div className="pie-segment pending"></div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color confirmed"></span>
                  <span>Đã xác nhận</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color completed"></span>
                  <span>Hoàn thành</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color cancelled"></span>
                  <span>Đã hủy</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color pending"></span>
                  <span>Chờ xử lý</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;