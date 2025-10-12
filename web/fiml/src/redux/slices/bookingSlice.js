// src/redux/slices/bookingSlice.js
import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    selectedFilm: null,
    selectedShowtime: null,
    selectedSeats: [],
    step: 'film',
    totalAmount: 0
  },
  reducers: {
    selectFilm: (state, action) => {
      state.selectedFilm = action.payload;
      state.step = 'showtime';
    },
    selectShowtime: (state, action) => {
      state.selectedShowtime = action.payload;
      state.step = 'seats';
    },
    selectSeats: (state, action) => {
      state.selectedSeats = action.payload.seats;
      state.totalAmount = action.payload.totalAmount;
    },
    nextStep: (state) => {
      const steps = ['film', 'showtime', 'seats', 'payment'];
      const currentIndex = steps.indexOf(state.step);
      if (currentIndex < steps.length - 1) {
        state.step = steps[currentIndex + 1];
      }
    },
    prevStep: (state) => {
      const steps = ['film', 'showtime', 'seats', 'payment'];
      const currentIndex = steps.indexOf(state.step);
      if (currentIndex > 0) {
        state.step = steps[currentIndex - 1];
      }
    },
    resetBooking: (state) => {
      state.selectedFilm = null;
      state.selectedShowtime = null;
      state.selectedSeats = [];
      state.step = 'film';
      state.totalAmount = 0;
    }
  }
});

export const {
  selectFilm,
  selectShowtime,
  selectSeats,
  nextStep,
  prevStep,
  resetBooking
} = bookingSlice.actions;
export default bookingSlice.reducer;