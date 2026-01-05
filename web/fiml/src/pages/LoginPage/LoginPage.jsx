import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import '../LoginPage/LoginPage.css'

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      dispatch(loginFailure('Vui lòng nhập email và mật khẩu'));
      return;
    }

    dispatch(loginStart());

    try {
      const response = await fetch('https://1i5z0-8080.csb.app/users');
      const users = await response.json();

      const user = users.find(u =>
        u.email === formData.email && u.password === formData.password
      );

      if (user) {
        // Login thành công
        const userInfo = {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone
        };

        dispatch(loginSuccess(userInfo));
        navigate('/'); // Về trang chủ
      } else {
        dispatch(loginFailure('Email hoặc mật khẩu không đúng'));
      }
    } catch (error) {
      dispatch(loginFailure('Lỗi kết nối server'));
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Đăng Nhập</h1>
          <p>Chào mừng bạn trở lại!</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email"
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>
        <div className="register-link">
          Chưa có tài khoản?
          <Link to="/register">Đăng ký ngay</Link>
        </div>
        <div className="demo-account">
          <h3>Tài khoản demo:</h3>
          <p>Email: <strong>user@example.com</strong></p>
          <p>Mật khẩu: <strong>123456</strong></p>
        </div>


      </div>
    </div>
  );
};

export default LoginPage;