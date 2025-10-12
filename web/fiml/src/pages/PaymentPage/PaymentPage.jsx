import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { filmAPI } from '../../services/api';
import '../PaymentPage/PaymentPage.css'

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(state => state.auth);
  const { film, showtime, selectedSeats, totalAmount } = location.state || {};
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    paymentMethod: 'momo'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // TỰ ĐỘNG ĐIỀN THÔNG TIN KHI USER ĐÃ ĐĂNG NHẬP
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        paymentMethod: 'momo'
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!film || !showtime || !selectedSeats) return;

    setLoading(true);
    try {
      const completeBooking = {
        showtimeId: showtime.id,
        filmId: film.id,
        filmName: film.nameFilm,
        cinemaId: showtime.cinemaId,
        roomId: showtime.roomId,
        datetime: showtime.datetime,
        seats: selectedSeats.map(seat => seat.id),
        totalAmount: totalAmount,
        status: "confirmed",
        customerInfo: {
          ...formData,
          userId: user.id
        },
        userId: user.id, // Thêm userId vào booking
        paymentMethod: formData.paymentMethod,
        paymentStatus: "paid",
        createdAt: new Date().toISOString()
      };

      await filmAPI.createBooking(completeBooking);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      alert('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (!film || !showtime) {
    return (
      <div className="payment-page">
        <div className="error">Thông tin đặt vé không hợp lệ</div>
        <button onClick={() => navigate('/')}>Về trang chủ</button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="payment-success">
        <div className="success-content">
          <div className="success-icon">✅</div>
          <h2>Thanh Toán Thành Công!</h2>
          <p>Cảm ơn bạn đã đặt vé. Thông tin vé đã được gửi đến email của bạn.</p>
          <div className="booking-details">
            <h3>Thông tin đặt vé:</h3>
            <p><strong>Phim:</strong> {film.nameFilm}</p>
            <p><strong>Suất chiếu:</strong> {new Date(showtime.datetime).toLocaleString('vi-VN')}</p>
            <p><strong>Phòng:</strong> {showtime.roomId?.replace('room_', '')}</p>
            <p><strong>Ghế:</strong> {selectedSeats.map(seat => seat.id).join(', ')}</p>
            <p><strong>Tổng tiền:</strong> {totalAmount.toLocaleString()}đ</p>
            <p><strong>Phương thức:</strong> {
              formData.paymentMethod === 'momo' ? 'Ví MoMo' :
              formData.paymentMethod === 'zalopay' ? 'ZaloPay' :
              formData.paymentMethod === 'banking' ? 'Chuyển khoản' : 'Tiền mặt'
            }</p>
          </div>
          <button className="back-home-btn" onClick={() => navigate('/')}>
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <h2>Thanh Toán</h2>
      
      <div className="payment-content">
        <div className="booking-summary">
          <h3>Thông tin đặt vé</h3>
          <div className="summary-item">
            <strong>Phim:</strong>
            <span>{film.nameFilm}</span>
          </div>
          <div className="summary-item">
            <strong>Suất chiếu:</strong>
            <span>{new Date(showtime.datetime).toLocaleString('vi-VN')}</span>
          </div>
          <div className="summary-item">
            <strong>Phòng:</strong>
            <span>{showtime.roomId?.replace('room_', '')}</span>
          </div>
          <div className="summary-item">
            <strong>Ghế:</strong>
            <span>{selectedSeats.map(seat => seat.id).join(', ')}</span>
          </div>
          <div className="summary-item total">
            <strong>Tổng tiền:</strong>
            <span className="price">{totalAmount.toLocaleString()}đ</span>
          </div>
        </div>

        <form className="payment-form" onSubmit={handleSubmit}>
          <h3>Thông tin khách hàng</h3>
          
          <div className="form-group">
            <label htmlFor="fullName">Họ và tên *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              placeholder="Nhập họ và tên"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Nhập email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="form-group">
            <label>Phương thức thanh toán *</label>
            <div className="payment-methods">
              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="momo"
                  checked={formData.paymentMethod === 'momo'}
                  onChange={handleInputChange}
                />
                <div className="method-info">
                  <span className="method-icon">📱</span>
                  <span>Ví MoMo</span>
                </div>
              </label>

              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="zalopay"
                  checked={formData.paymentMethod === 'zalopay'}
                  onChange={handleInputChange}
                />
                <div className="method-info">
                  <span className="method-icon">💙</span>
                  <span>ZaloPay</span>
                </div>
              </label>

              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="banking"
                  checked={formData.paymentMethod === 'banking'}
                  onChange={handleInputChange}
                />
                <div className="method-info">
                  <span className="method-icon">🏦</span>
                  <span>Chuyển khoản</span>
                </div>
              </label>

              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handleInputChange}
                />
                <div className="method-info">
                  <span className="method-icon">💵</span>
                  <span>Tiền mặt</span>
                </div>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading || !formData.fullName || !formData.email || !formData.phone}
          >
            {loading ? 'Đang xử lý...' : `Thanh Toán ${totalAmount.toLocaleString()}đ`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;