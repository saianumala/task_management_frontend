import { createSlice } from "@reduxjs/toolkit";

interface FilterState {
  statusFilter: "all" | "complete" | "incomplete";
  dateFilter: "all" | "today" | "yesterday";
}

const initialState: FilterState = {
  statusFilter: "all",
  dateFilter: "all",
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
    setDateFilter(state, action) {
      state.dateFilter = action.payload;
    },
  },
});

export const { setStatusFilter, setDateFilter } = filterSlice.actions;
export default filterSlice.reducer;
