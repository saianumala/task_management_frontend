import { createSlice } from "@reduxjs/toolkit";
import { Task } from "../../types";
const selectedTaskSlice = createSlice({
  name: "selectedTask",
  initialState: null as Task | null,
  reducers: {
    setSelectedTask: (state, action) => {
      console.log("set selected task", action.payload);
      return action.payload;
    },
  },
});
export const { setSelectedTask } = selectedTaskSlice.actions;
export default selectedTaskSlice.reducer;
