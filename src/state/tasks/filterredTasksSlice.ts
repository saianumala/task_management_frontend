import { createSlice } from "@reduxjs/toolkit";
import { Task } from "../../types";
import dayjs from "dayjs";

const filteredTasksSlice = createSlice({
  name: "filteredTasks",
  initialState: [] as Task[],
  reducers: {
    filterTasks: (state, action) => {
      const now = dayjs();
      console.log(action.payload);
      const { statusFilter, dateFilter, tasks } = action.payload;
      console.log(statusFilter, tasks);
      return tasks
        .filter((task: Task) => {
          if (statusFilter === "complete") {
            return task.status === "complete";
          }
          if (statusFilter === "incomplete") {
            return task.status !== "complete";
          }
          return true;
        })
        .filter((task: Task) => {
          const due = dayjs(task.dueDate);
          if (dateFilter === "today") return due.isSame(now, "day");
          if (dateFilter === "yesterday")
            return due.isSame(now.subtract(1, "day"), "day");
          return true;
        });
    },
  },
});

export const { filterTasks } = filteredTasksSlice.actions;
export default filteredTasksSlice.reducer;
