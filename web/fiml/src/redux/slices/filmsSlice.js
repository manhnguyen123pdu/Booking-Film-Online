// src/redux/slices/filmsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { filmAPI } from '../../services/api';

export const fetchFilms = createAsyncThunk('films/fetchFilms', async () => {
  const response = await filmAPI.getFilms();
  return response;
});

export const fetchFilmDetail = createAsyncThunk('films/fetchFilmDetail', async (filmId) => {
  const [film, showtimes] = await Promise.all([
    filmAPI.getFilmById(filmId),
    filmAPI.getShowtimesByFilm(filmId)
  ]);
  return { film, showtimes };
});

const filmsSlice = createSlice({
  name: 'films',
  initialState: {
    items: [],
    currentFilm: null,
    showtimes: [],
    loading: false,
    error: null
  },
  reducers: {
    setCurrentFilm: (state, action) => {
      state.currentFilm = action.payload;
    },
    clearCurrentFilm: (state) => {
      state.currentFilm = null;
      state.showtimes = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFilms.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFilms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFilmDetail.fulfilled, (state, action) => {
        state.currentFilm = action.payload.film;
        state.showtimes = action.payload.showtimes;
      });
  }
});

export const { setCurrentFilm, clearCurrentFilm } = filmsSlice.actions;
export default filmsSlice.reducer;