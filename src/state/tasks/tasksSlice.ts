import { createSlice } from "@reduxjs/toolkit";
import { Task } from "../../types";

// interface Task {
//   id: number;
//   userId: string;
//   title: string;
//   description: string;
//   status: "complete" | "incomplete";
//   priority: "high" | "medium" | "low";
//   dueDate: Date;

// }

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [] as Task[],
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(
        (task) => task.id === action.payload.id
      );
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...action.payload };
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
  },
});

export const { setTasks, addTask, updateTask, deleteTask } = tasksSlice.actions;

export default tasksSlice.reducer;
