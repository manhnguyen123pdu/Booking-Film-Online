import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import HomePage from './pages/HomePage/HomePage';
import FilmDetailPage from './pages/FilmDetailPage/FilmDetailPage';
import ShowtimePage from './pages/ShowtimePage/ShowtimePage';
import SeatSelectionPage from './pages/SeatSelectionPage/SeatSelectionPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import BookingLayout from './layouts/BookingLayout';
import './App.css';
import AllFilmsPage from './pages/AllFilmsPage/AllFilmsPage';
import AccountPage from './pages/AccountPage/AccountPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/film/:filmId" element={<FilmDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/allsFilm" element={<AllFilmsPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage/>} />


            {/* CÁC ROUTE CẦN ĐĂNG NHẬP */}
            <Route path="/booking" element={
              <ProtectedRoute>
                <BookingLayout />
              </ProtectedRoute>
            }>
              <Route path=":filmId" element={<ShowtimePage />} />
              <Route path=":filmId/showtime/:showtimeId" element={<SeatSelectionPage />} />
              <Route path="payment" element={<PaymentPage />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;