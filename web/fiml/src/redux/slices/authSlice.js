

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { filmAPI } from '../../services/api';

// Async thunk for updating profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ userId, ...profileData }, { rejectWithValue }) => {
    try {
      const response = await filmAPI.updateUser(userId, profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Update failed');
    }
  }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await filmAPI.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Lấy thông tin user từ localStorage (nếu có)
const getUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getUserFromLocalStorage(),
    loading: false,
    error: null,
    isAuthenticated: !!getUserFromLocalStorage()
  },
  reducers: {
    // Đăng nhập thành công
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    
    // Đăng nhập thất bại
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    
    // Bắt đầu đăng nhập
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    
    // Đăng xuất
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
    
    // Xóa lỗi
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Update Profile cases
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload };
        state.error = null;
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  clearError 
} = authSlice.actions;

export default authSlice.reducer;