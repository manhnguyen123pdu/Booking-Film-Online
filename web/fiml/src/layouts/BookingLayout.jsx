import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import "../layouts/bookingLayout.css"

const BookingLayout = () => {
  const navigate = useNavigate();
  const { filmId } = useParams();
  const { selectedFilm } = useSelector(state => state.films);

  const getCurrentStep = () => {
    const path = window.location.pathname;
    if (path.includes('showtime')) return 2;
    if (path.includes('payment')) return 3;
    return 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div className="booking-layout">
      <Header/>
          <header className="header1">
            
        {/* <button className="back-btn" onClick={() => navigate(-1)}>← Quay lại</button> */}
        <h1>Đặt Vé Xem Phim</h1>
        <div className="booking-progress">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1. Chọn Suất Chiếu</div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2. Chọn Ghế</div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3. Thanh Toán</div>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default BookingLayout;