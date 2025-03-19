import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface LoginParams {
  email: string;
  password: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false
};

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (params: LoginParams) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/login`,
      params
    );
    return response.data;
  }
);

export const registerAsync = createAsyncThunk(
  "auth/login",
  async (params: RegisterParams) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/register`,
      params
    );
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsync.pending, (state, action) => {
      state.loading = true
    });
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.data.userData;
      state.loading = false
      localStorage.setItem("token", action.payload.data.token);
    });
    builder.addCase(loginAsync.rejected, (state, action) => {
      state.isAuthenticated = false;
      state.loading = false
    });
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
