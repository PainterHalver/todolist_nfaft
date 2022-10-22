import { TodoStateType } from "./../lib/types";
import { createSlice } from "@reduxjs/toolkit";
import type { AppState } from "./store";

// Type for our state
interface TodoState {
  currentTodoId: string;
  currentTodo: TodoStateType;
}

interface ActionType {
  payload: {
    id: string;
    todo: TodoStateType;
  };
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
    registerCurrentTodo: (state, action: ActionType) => {
      state.currentTodoId = action.payload.id;
      state.currentTodo = action.payload.todo;
    },
    unregisterCurrentTodo: (state) => {
      state.currentTodoId = "";
      state.currentTodo = initialState.currentTodo;
    },
  },
});

export const { registerCurrentTodo, unregisterCurrentTodo } = todoSlice.actions;

export const selectCurrentTodoId = (state: AppState) => state.todo.currentTodoId;
export const selectCurrentTodo = (state: AppState) => state.todo.currentTodo;

export default todoSlice.reducer;
