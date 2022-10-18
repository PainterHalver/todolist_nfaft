import { Prisma } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import type { AppState } from "./store";

// Type for our state
interface AuthState {
  authenticated: boolean;
  user: Prisma.UserCreateInput | null;
}

// Initial state
const initialState: AuthState = {
  authenticated: false,
  user: null,
};

// Actual Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.authenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.authenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export const selectAuthenticated = (state: AppState) => state.auth.authenticated;
export const selectUser = (state: AppState) => state.auth.user;

export default authSlice.reducer;
