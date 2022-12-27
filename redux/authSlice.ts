import { createSlice } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import type { AppState } from "./store";

// Type for our state
interface AuthState {
  authenticated: boolean;
  user: User | null;
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
      return {
        ...state,
        authenticated: true,
        user: action.payload,
      };
    },
    logout: (state) => {
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    },
  },
});

export const { login, logout } = authSlice.actions;

export const selectAuthenticated = (state: AppState) => state.auth.authenticated;
export const selectUser = (state: AppState) => state.auth.user;

export default authSlice.reducer;
