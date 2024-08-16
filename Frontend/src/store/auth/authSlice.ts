import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  removeToken,
  setToken,
  setRefreshToken,
  removeRefreshToken,
} from '../../utils/auth';
import { Role, User } from '../../types';
import { login as loginService, logout as logoutService } from '../../api/auth';
import {
  LoginForm,
  LoginUser,
} from '../../pages/Login/Interface/LoginInterface';
import { refreshAccessToken } from '../../api/refresh';
import { LogoutData } from '../../api/logout';
import { reIssuanceJwtToken } from '../../utils/utils';

interface AuthState {
  username: any;
  user: User | null;
  avatar: string;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  username: 'client',
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  avatar: '/image/user.png',
};

const mapLoginUserToUser = (loginUser: LoginUser): User => {
  return {
    id: loginUser.pk,
    name: loginUser.name,
    role: loginUser.role,
    avatar: loginUser.avatar,
  };
};

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (token: string) => {
    const response = await fetch('http://localhost:8000/api/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  },
);

let accessTimer: NodeJS.Timeout | null = null;

export const login = createAsyncThunk(
  'auth/login',
  async (loginForm: LoginForm, { rejectWithValue }) => {
    try {
      const response = await loginService(loginForm);
      setToken(response.access);
      setRefreshToken(response.refresh);
      scheduleTokenRefresh(response.access, 3600 * 1000 - 60000);

      return mapLoginUserToUser(response.user);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred',
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (logoutData: LogoutData, { rejectWithValue }) => {
    try {
      await logoutService(logoutData);
      removeToken();
      removeRefreshToken();
      if (accessTimer) {
        clearTimeout(accessTimer);
      }
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Logout failed',
      );
    }
  },
);

export const scheduleTokenRefresh = (refreshToken: string, delay: number) => {
  accessTimer = setTimeout(async () => {
    try {
      reIssuanceJwtToken(refreshToken);

      const newTokens = await refreshAccessToken({ refresh: refreshToken });
      setToken(newTokens.access);
      scheduleTokenRefresh(refreshToken, 3600 * 1000 - 60000);
    } catch (error) {
      console.error('토큰 갱신 실패: ', error);
      removeToken();
      removeRefreshToken();
      window.location.href = '/';
    }
  }, delay);
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.avatar = action.payload.avatar;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.avatar = action.payload.avatar;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
