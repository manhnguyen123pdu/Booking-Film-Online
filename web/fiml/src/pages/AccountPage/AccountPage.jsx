import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, updateProfile } from '../../redux/slices/authSlice';
import { filmAPI } from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './AccountPage.css';


const AccountPage = () => {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('profile');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [cancellingBooking, setCancellingBooking] = useState(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                dateOfBirth: user.dateOfBirth || '',
                gender: user.gender || ''
            });
            fetchUserBookings();
        }
    }, [user]);

    const fetchUserBookings = async () => {
        try {
            setLoading(true);
            const userBookings = await filmAPI.getBookingsByUser(user.id);
            setBookings(userBookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            await dispatch(updateProfile({ userId: user.id, ...formData })).unwrap();
            setEditMode(false);
            alert('Cập nhật thông tin thành công!');
        } catch (error) {
            alert('Có lỗi xảy ra khi cập nhật thông tin');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setFormData({
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
            dateOfBirth: user.dateOfBirth || '',
            gender: user.gender || ''
        });
        setEditMode(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
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

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy vé này?')) return;

        try {
            setCancellingBooking(bookingId);
            await filmAPI.cancelBooking(bookingId);

            // Cập nhật lại danh sách booking
            const updatedBookings = bookings.map(booking =>
                booking.id === bookingId
                    ? { ...booking, status: 'cancelled' }
                    : booking
            );
            setBookings(updatedBookings);
            alert('Hủy vé thành công!');
        } catch (error) {
            alert('Có lỗi xảy ra khi hủy vé: ' + error.message);
        } finally {
            setCancellingBooking(null);
        }
    };


    if (!user) {
        return (
            <div className="account-page">
                <div className="not-logged-in">
                    <div className="login-prompt">
                        <h2>Vui lòng đăng nhập</h2>
                        <p>Bạn cần đăng nhập để xem thông tin tài khoản</p>
                        <button
                            className="login-btn"
                            onClick={() => navigate('/login')}
                        >
                            Đăng nhập ngay
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="account-page">
                <div className="account-container">
                    {/* Sidebar */}
                    <div className="account-sidebar">
                        <div className="user-profile-card">
                            <div className="avatar-section">
                                <div className="user-info">
                                    <h3>{user.fullName || 'Người dùng'}</h3>
                                    <p>{user.email}</p>

                                </div>
                            </div>

                            <div className="stats-section">
                                <div className="stat-item">
                                    <span className="stat-number">{bookings.length}</span>
                                    <span className="stat-label">Vé đã đặt</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">
                                        {bookings.filter(b => b.status === 'completed').length}
                                    </span>
                                    <span className="stat-label">Đã xem</span>
                                </div>
                            </div>
                        </div>

                        <nav className="sidebar-nav">
                            <button
                                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <span className="nav-icon">👤</span>
                                Thông tin cá nhân
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('bookings')}
                            >
                                <span className="nav-icon">🎫</span>
                                Lịch sử đặt vé
                            </button>
                            <button
                                className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                                onClick={() => setActiveTab('settings')}
                            >
                                <span className="nav-icon">⚙️</span>
                                Cài đặt
                            </button>
                            <button
                                className="nav-item logout-btn"
                                onClick={handleLogout}
                            >
                                <span className="nav-icon">🚪</span>
                                Đăng xuất
                            </button>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="account-content">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="tab-content">
                                <div className="tab-header">
                                    <h2>Thông tin cá nhân</h2>
                                    {!editMode ? (
                                        <button
                                            className="edit-btn"
                                            onClick={() => setEditMode(true)}
                                        >
                                            ✏️ Chỉnh sửa
                                        </button>
                                    ) : (
                                        <div className="edit-actions">
                                            <button
                                                className="cancel-btn"
                                                onClick={handleCancelEdit}
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                className="save-btn"
                                                onClick={handleSaveProfile}
                                                disabled={loading}
                                            >
                                                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="profile-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Họ và tên</label>
                                            {editMode ? (
                                                <input
                                                    type="text"
                                                    name="fullName"
                                                    value={formData.fullName}
                                                    onChange={handleInputChange}
                                                    placeholder="Nhập họ và tên"
                                                />
                                            ) : (
                                                <div className="info-display">{user.fullName || 'Chưa cập nhật'}</div>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label>Email</label>
                                            <div className="info-display">{user.email}</div>
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Số điện thoại</label>
                                            {editMode ? (
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="Nhập số điện thoại"
                                                />
                                            ) : (
                                                <div className="info-display">{user.phone || 'Chưa cập nhật'}</div>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label>Ngày sinh</label>
                                            {editMode ? (
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={formData.dateOfBirth}
                                                    onChange={handleInputChange}
                                                />
                                            ) : (
                                                <div className="info-display">
                                                    {user.dateOfBirth ? formatDate(user.dateOfBirth) : 'Chưa cập nhật'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Giới tính</label>
                                            {editMode ? (
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Chọn giới tính</option>
                                                    <option value="male">Nam</option>
                                                    <option value="female">Nữ</option>
                                                    <option value="other">Khác</option>
                                                </select>
                                            ) : (
                                                <div className="info-display">
                                                    {user.gender === 'male' ? 'Nam' :
                                                        user.gender === 'female' ? 'Nữ' :
                                                            user.gender === 'other' ? 'Khác' : 'Chưa cập nhật'}
                                                </div>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label>Ngày tham gia</label>
                                            <div className="info-display">
                                                {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bookings Tab */}
                        {activeTab === 'bookings' && (
                            <div className="tab-content">
                                <div className="tab-header">
                                    <h2>Lịch sử đặt vé</h2>
                                    <span className="booking-count">{bookings.length} vé đã đặt</span>
                                </div>

                                {loading ? (
                                    <div className="loading-bookings">
                                        <div className="spinner"></div>
                                        <p>Đang tải lịch sử đặt vé...</p>
                                    </div>
                                ) : bookings.length > 0 ? (
                                    <div className="bookings-list">
                                        {bookings.map(booking => (
                                            <div key={booking.id} className="booking-card">
                                                <div className="booking-header">
                                                    <h3>{booking.filmName}</h3>
                                                    {getStatusBadge(booking.status)}
                                                </div>

                                                <div className="booking-details">
                                                    <div className="detail-item">
                                                        <span className="label">📅 Suất chiếu:</span>
                                                        <span>{formatDate(booking.datetime)}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">🎬 Phòng:</span>
                                                        <span>{booking.roomId?.replace('room_', '')}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">💺 Ghế:</span>
                                                        <span>{booking.seats?.join(', ')}</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">💰 Tổng tiền:</span>
                                                        <span className="price">{booking.totalAmount?.toLocaleString()}đ</span>
                                                    </div>
                                                    <div className="detail-item">
                                                        <span className="label">💳 Phương thức:</span>
                                                        <span>{booking.paymentMethod === 'momo' ? 'Ví MoMo' :
                                                            booking.paymentMethod === 'zalopay' ? 'ZaloPay' :
                                                                booking.paymentMethod === 'banking' ? 'Chuyển khoản' :
                                                                    booking.paymentMethod === 'cash' ? 'Tiền mặt' : 'N/A'}</span>
                                                    </div>
                                                </div>

                                                <div className="booking-footer">
                                                    <span className="booking-id">Mã đơn: {booking.id}</span>
                                                    {booking.status === 'confirmed' || booking.status === 'pending' ? (
                                                        <button
                                                            className="cancel-booking-btn"
                                                            onClick={() => handleCancelBooking(booking.id)}
                                                            disabled={cancellingBooking === booking.id}
                                                        >
                                                            {cancellingBooking === booking.id ? 'Đang hủy...' : 'Hủy đặt vé'}
                                                        </button>
                                                    ) : (
                                                        <span className="cancelled-text">Đã hủy</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-bookings">
                                        <div className="empty-state">
                                            <span className="empty-icon">🎬</span>
                                            <h3>Chưa có vé nào được đặt</h3>
                                            <p>Hãy khám phá các bộ phim mới và đặt vé ngay!</p>
                                            <button
                                                className="explore-btn"
                                                onClick={() => navigate('/')}
                                            >
                                                Khám phá phim
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="tab-content">
                                <div className="tab-header">
                                    <h2>Cài đặt tài khoản</h2>
                                </div>

                                <div className="settings-section">
                                    <h3>Thông báo</h3>
                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <h4>Thông báo qua email</h4>
                                            <p>Nhận thông báo về khuyến mãi và phim mới</p>
                                        </div>
                                        <label className="switch">
                                            <input type="checkbox" defaultChecked />
                                            <span className="slider"></span>
                                        </label>
                                    </div>

                                    <div className="setting-item">
                                        <div className="setting-info">
                                            <h4>Thông báo SMS</h4>
                                            <p>Nhận thông báo qua tin nhắn điện thoại</p>
                                        </div>
                                        <label className="switch">
                                            <input type="checkbox" />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="settings-section">
                                    <h3>Bảo mật</h3>
                                    <button className="security-btn">
                                        🔒 Đổi mật khẩu
                                    </button>
                                    <button className="security-btn">
                                        📧 Thay đổi email
                                    </button>
                                </div>

                                <div className="settings-section danger-zone">
                                    <h3>Khu vực nguy hiểm</h3>
                                    <button className="danger-btn">
                                        🗑️ Xóa tài khoản
                                    </button>
                                    <p className="danger-note">
                                        Hành động này không thể hoàn tác. Tất cả dữ liệu sẽ bị xóa vĩnh viễn.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AccountPage;