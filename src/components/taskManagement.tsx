import { useEffect, useState } from "react";
import Tasks from "./tasks";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setDateFilter } from "../state/tasks/filtersSlice";
import { addTask, setTasks } from "../state/tasks/tasksSlice";
import { filterTasks } from "../state/tasks/filterredTasksSlice";
import { useNavigate } from "react-router-dom";

function TaskManagement() {
  const dispatch = useDispatch();
  const selectedDay = useSelector(
    (state: RootState) => state.filters.dateFilter
  );
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const statusFilter = useSelector(
    (state: RootState) => state.filters.statusFilter
  );
  const filteredTasks = useSelector((state: RootState) => state.filteredTasks);
  const dateFilter = useSelector(
    (state: RootState) => state.filters.dateFilter
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("fetching tasks");
    console.log("status filter: ", statusFilter);
    console.log("date filter: ", dateFilter);
    setIsLoading(true);
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKENDURL}/api/task/allTasks/all`,
          { credentials: "include" }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch tasks");
        }
        console.log(response);
        console.log("data", data);
        dispatch(setTasks(data));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);
  const handleLogout = async () => {
    const logoutResponse = await fetch(
      `${import.meta.env.VITE_BACKENDURL}/api/user/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (!logoutResponse.ok) {
      const data = await logoutResponse.json();
      throw new Error(data.message || "Failed to logout");
    }
    navigate("/login");
  };
  return (
    <div className="flex flex-col h-[95vh] gap-4">
      <div className="flex h-[30px] justify-between items-center bg-blue-400/60 p-6">
        <h1>TaskManagement</h1>
        <button
          onClick={handleLogout}
          className="hover:cursor-pointer hover:outline-2 rounded-md p-2"
        >
          Logout
        </button>
      </div>
      <div className="flex-1 h-4/6 flex justify-center items-center">
        <div className="flex h-full w-5/6 p-3 gap-2 bg-blue-400/20">
          <div className="h-full w-1/6 flex gap-4 flex-col mt-14">
            <button
              className={`p-4 rounded-lg ${
                selectedDay === "today" ? "bg-white/60" : ""
              } hover:bg-white/60`}
              onClick={() => dispatch(setDateFilter("today"))}
            >
              Todays
            </button>
            <button
              className={`p-4 rounded-lg ${
                selectedDay === "yesterday" ? "bg-white/60" : ""
              } hover:bg-white/60`}
              onClick={() => dispatch(setDateFilter("yesterday"))}
            >
              Yesterdays
            </button>
            <button
              className={`p-4 rounded-lg ${
                selectedDay === "all" ? "bg-white/60" : ""
              } hover:bg-white/60`}
              onClick={() => dispatch(setDateFilter("all"))}
            >
              All
            </button>
          </div>

          <div className="flex-1 h-full w-5/6 rounded-lg p-4 flex flex-col gap-4 bg-blue-400/20 backdrop-blur-2xl">
            <Tasks />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskManagement;
