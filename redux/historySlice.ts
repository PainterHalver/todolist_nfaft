import { Prisma } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";
import type { AppState } from "./store";

// Type for our state
interface HistoryState {
  history: string[];
}

// Initial state
const initialState: HistoryState = {
  history: [],
};

// Actual Slice
const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    push: (state, action) => {
      if (state.history[state.history.length - 1] !== action.payload) {
        state.history.push(action.payload);
      }
    },
  },
});

export const { push } = historySlice.actions;

export const selectHistory = (state: AppState) => state.history.history;
export const selectLastRoute = (state: AppState) => state.history.history[state.history.history.length - 1];

export default historySlice.reducer;
