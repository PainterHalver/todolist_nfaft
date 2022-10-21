import { createSlice } from "@reduxjs/toolkit";
import { Todo } from "../lib/types";
import type { AppState } from "./store";

// Type for our state
interface TodoState {
  currentTodoId: string;
  currentTodo: Todo;
}

// Initial state
const initialState: TodoState = {
  currentTodoId: "",
  currentTodo: {
    title: "",
    note: "",
    completed: false,
  },
};

// Actual Slice
const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    registerCurrentTodo: (state, action) => {
      state.currentTodoId = action.payload.id;
      state.currentTodo = action.payload.todo;
    },
    unregisterCurrentTodo: (state) => {
      state.currentTodoId = "";
      state.currentTodo = null;
    },
  },
});

export const { registerCurrentTodo, unregisterCurrentTodo } = todoSlice.actions;

export const selectCurrentTodoId = (state: AppState) => state.todo.currentTodoId;
export const selectCurrentTodo = (state: AppState) => state.todo.currentTodo;

export default todoSlice.reducer;
