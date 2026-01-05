// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import filmsReducer from './slices/filmsSlice';
import bookingReducer from './slices/bookingSlice';
import authReducer from './slices/authSlice';
export const store = configureStore({
  reducer: {
    films: filmsReducer,
    booking: bookingReducer,
    auth: authReducer,
  },
});