import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/authSlice';
import '../LoginPage/LoginPage.css'; // Dùng chung CSS với Login
import '../RegisterPage/RegisterPage.css'
const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = 'Họ và tên là bắt buộc';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^\d{10,11}$/.test(formData.phone)) {
      errors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.password) {
      errors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    dispatch(loginStart());

    try {
      // Kiểm tra email đã tồn tại chưa
      const usersResponse = await fetch('https://1i5z0-8080.csb.app/users');
      const users = await usersResponse.json();
      
      const existingUser = users.find(u => u.email === formData.email);
      if (existingUser) {
        dispatch(loginFailure('Email đã được sử dụng'));
        return;
      }

      // Tạo user mới
      const newUser = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        dateOfBirth: '',
        gender: '',
        createdAt: new Date().toISOString()
      };

      const response = await fetch('https://1i5z0-8080.csb.app/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        // Đăng ký thành công, tự động đăng nhập
        const userInfo = {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          phone: newUser.phone
        };
        
        dispatch(loginSuccess(userInfo));
        navigate('/');
      } else {
        dispatch(loginFailure('Đăng ký thất bại. Vui lòng thử lại.'));
      }
    } catch (error) {
      dispatch(loginFailure('Lỗi kết nối server'));
    }
  };

  return (
    <div className="login-page resgiter">
      <div className="login-container">
        <div className="login-header">
          <h1>Đăng Ký</h1>
          <p>Tạo tài khoản mới của bạn</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên đầy đủ"
              className={validationErrors.fullName ? 'error' : ''}
            />
            {validationErrors.fullName && (
              <span className="field-error">{validationErrors.fullName}</span>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Nhập email"
              className={validationErrors.email ? 'error' : ''}
            />
            {validationErrors.email && (
              <span className="field-error">{validationErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
              className={validationErrors.phone ? 'error' : ''}
            />
            {validationErrors.phone && (
              <span className="field-error">{validationErrors.phone}</span>
            )}
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Nhập mật khẩu"
              className={validationErrors.password ? 'error' : ''}
            />
            {validationErrors.password && (
              <span className="field-error">{validationErrors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Nhập lại mật khẩu"
              className={validationErrors.confirmPassword ? 'error' : ''}
            />
            {validationErrors.confirmPassword && (
              <span className="field-error">{validationErrors.confirmPassword}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </form>

        <div className="demo-account">
          <h3>Thông tin tài khoản demo:</h3>
          <p>Email: <strong>user@example.com</strong></p>
          <p>Mật khẩu: <strong>123456</strong></p>
        </div>

        <div className="register-link">
          Đã có tài khoản? 
          <Link to="/login">Đăng nhập ngay</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;