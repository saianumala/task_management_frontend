import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../state/tasks/tasksSlice";
import filterByDay from "../state/tasks/filterredTasksSlice";
import filters from "../state/tasks/filtersSlice";
import selectedTask from "../state/tasks/selectedTaskSlice";
const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    filteredTasks: filterByDay,
    filters: filters,
    selectedTask: selectedTask,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
