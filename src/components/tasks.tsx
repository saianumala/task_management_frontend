import React, { useEffect, useRef, useState } from "react";
import TaskItem from "./taskItem";
import { Priority, Status, Task } from "../types";
import TaskDetail from "./taskDetails";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addTask, updateTask } from "../state/tasks/tasksSlice";
import dayjs from "dayjs";
import { filterTasks } from "../state/tasks/filterredTasksSlice";
import { setStatusFilter } from "../state/tasks/filtersSlice";
import TaskForm from "./taskForm";
import LoadingSpinner from "./loadingSpinner";
import { setSelectedTask } from "../state/tasks/selectedTaskSlice";
function Tasks() {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const statusFilter = useSelector(
    (state: RootState) => state.filters.statusFilter
  );
  const filteredTasks = useSelector((state: RootState) => state.filteredTasks);
  const dateFilter = useSelector(
    (state: RootState) => state.filters.dateFilter
  );
  const [isLoading, setIsLoading] = useState(false);

  const selectedTask = useSelector((state: RootState) => state.selectedTask);
  const dispatch = useDispatch();
  const addTaskDialog = useRef<HTMLDialogElement | null>(null);

  console.log(filteredTasks);
  // // Create a new task
  const createTask = async (
    taskData: Omit<
      Task,
      "id" | "status" | "userId" | "createdAt" | "updatedAt" | "completedAt"
    >
  ) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKENDURL}/api/task/create`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...taskData }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create task");
      }
      console.log(data);
      dispatch(addTask(data));
      dispatch(setSelectedTask(data));

      addTaskDialog.current?.close();
    } catch (err) {
      // setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex h-full w-full flex-col">
      <dialog
        className="w-3/6 h-3/4 top-2/4 left-2/4 -translate-x-[50%] -translate-y-[50%] justify-center items-center"
        ref={addTaskDialog}
      >
        <div className="bg-blue-400/20 w-full h-full ">
          <TaskForm dialogRef={addTaskDialog} onSubmit={createTask} />
        </div>
      </dialog>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="h-full w-full flex flex-col gap-4">
          <div className="flex flex-col justify-around items-start gap-3 h-4/6 w-full ">
            <div className="flex w-full justify-between items-center">
              <div
                className="flex h-15 justify-items-end items-
              p-4 rounded-lg border-black border-2 border-solid"
              >
                <select
                  className="w-full h-full"
                  value={statusFilter}
                  onChange={(e) => {
                    const filter =
                      e.target.value === "incomplete"
                        ? "incomplete"
                        : e.target.value === "complete"
                        ? "complete"
                        : "all";
                    dispatch(setStatusFilter(filter));
                  }}
                >
                  <option value="all">All</option>
                  <option value="incomplete">Active</option>
                  <option value="complete">Completed</option>
                </select>
              </div>
              <div
                onClick={() => addTaskDialog.current?.showModal()}
                className="bg-blue-400/20 hover:cursor-pointer border-black border-2 border-solid p-4 rounded-md hover:scale-105 active:scale-95 transition-all"
              >
                <button>Add Task</button>
              </div>
            </div>
            <div className="w-full h-full">
              {selectedTask && <TaskDetail />}
            </div>
          </div>
          {filteredTasks.length > 0 ? (
            <div className="h-2/6 w-full flex gap-4 justify-evenly overflow-x-auto">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="h-40 p-3 hover:scale-105 hover:cursor-pointer transition-transform duration-300"
                  onClick={() => dispatch(setSelectedTask(task))}
                >
                  <TaskItem task={task} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <h1 className="font-extrabold">
                No Tasks Scheduled for this Day
              </h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Tasks;
