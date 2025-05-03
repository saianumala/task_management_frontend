import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../state/tasks/tasksSlice";
import filterByDay from "../state/tasks/filterredTasksSlice";
import filters from "../state/tasks/filtersSlice";
const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    filteredTasks: filterByDay,
    filters: filters,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
