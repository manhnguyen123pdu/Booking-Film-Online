import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import '../components/style.css'
const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
  };

  const handleProfileClick = () => {
    navigate('/account');
    setShowDropdown(false);
  };

  const handleBookingHistory = () => {
    navigate('/account');
    setShowDropdown(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-icon">🎬</span>
          <span className="logo-text">CineMax</span>
        </div>

        <nav className="nav-menu">
          <Link className="nav-link" to={"/allsFilm"}>Phim đang chiếu</Link>
          <a href="#coming-soon" className="nav-link">Phim Sắp Chiếu</a>
          <a href="#promotions" className="nav-link">Khuyến Mãi</a>
        </nav>

        <div className="header-actions">
          {user ? (
            <div className="user-section">
              <div 
                className="user-info"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="user-greeting">Xin chào, {user.fullName}</span>
                <span className="dropdown-arrow">▼</span>
              </div>
              
              {showDropdown && (
                <div className="user-dropdown">
                  <div className="dropdown-item" onClick={handleProfileClick}>
                    👤 Tài khoản
                  </div>
                  
                  <div className="dropdown-item" onClick={handleBookingHistory}>
                    📖 Lịch sử đặt vé
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    🚪 Đăng xuất
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="login-btn"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;