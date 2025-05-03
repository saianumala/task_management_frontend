import { useEffect, useRef, useState } from "react";
import { Priority, Status, Task } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, updateTask } from "../state/tasks/tasksSlice";
import TaskForm from "./taskForm";
import { setSelectedTask } from "../state/tasks/selectedTaskSlice";
import { RootState } from "../store/store";

function TaskDetail() {
  const dispatch = useDispatch();
  const task = useSelector((state: RootState) => state.selectedTask);
  const [isLoading, setIsLoading] = useState(false);
  const updateTaskRef = useRef<HTMLDialogElement | null>(null);
  const deleteTaskRef = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {}, []);
  const taskUpdate = async (updatedTask: Task) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKENDURL}/api/task/update`,
        {
          credentials: "include",
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...updatedTask }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update task");
      console.log(data);
      dispatch(updateTask(data.updatedTask));
      dispatch(setSelectedTask(data.updatedTask));
      updateTaskRef.current?.close();
    } catch (err) {
      // setError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  const taskDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKENDURL}/api/task/delete/${task?.id}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete task");
      }
      dispatch(deleteTask(task?.id));
      dispatch(setSelectedTask(null));
      deleteTaskRef.current?.close();
    } catch (err) {
      // setError(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      {task && (
        <div
          className={`w-full h-full ${
            task.priority === "high"
              ? "bg-red-400"
              : task.priority === "medium"
              ? "bg-yellow-400"
              : "bg-green-400"
          } rounded-lg pl-2 shadow-md pb-1 hover:shadow-lg transition-shadow duration-300`}
        >
          <div className="flex flex-col gap-4 w-full h-full p-4 bg-white/70 rounded-lg backdrop-blur-2xl">
            <dialog
              className="w-3/6 h-3/4 top-2/4 left-2/4 -translate-x-[50%] -translate-y-[50%] justify-center items-center"
              ref={updateTaskRef}
            >
              <div className="bg-blue-400/20 w-full h-full ">
                <TaskForm
                  dialogRef={updateTaskRef}
                  onSubmit={taskUpdate}
                  task={task}
                />
              </div>
            </dialog>
            <dialog
              className="w-2/6 h-1/6 top-2/4 left-2/4 -translate-x-[50%] -translate-y-[50%] justify-center items-center"
              ref={deleteTaskRef}
            >
              <div className="flex justify-center items-center flex-col w-full h-full bg-blue-400/20">
                <h1 className="font-extrabold">
                  Are you sure you want to delete?
                </h1>
                <div>
                  <button
                    onClick={() => deleteTaskRef.current?.close()}
                    className="bg-blue-400/20 hover:cursor-pointer p-3 m-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={taskDelete}
                    className="bg-blue-400/20 hover:cursor-pointer p-3 m-2 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </dialog>
            <div className="h-[30px] flex gap-2 justify-between items-center">
              <div
                onClick={async () => {
                  const updatedTask: Task = {
                    ...task,
                    status:
                      task.status === "complete"
                        ? Status.INCOMPLETE
                        : Status.COMPLETED,
                  };
                  await taskUpdate(updatedTask);
                }}
                className={`hover:cursor-pointer w-5 h-5 rounded-full ${
                  task.priority === "high"
                    ? "bg-red-400"
                    : task.priority === "medium"
                    ? "bg-yellow-400"
                    : "bg-green-400"
                } flex justify-center items-center`}
              >
                {task.status === "complete" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000000"
                  >
                    <path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z" />
                  </svg>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-white/90"></div>
                )}
              </div>
              <h1
                className={`flex-1 text-xl font-extrabold ${
                  task.status === "complete" && "line-through"
                }`}
              >
                {task.title}
              </h1>
              <p>{task.priority}</p>
            </div>
            <div className="flex-1">
              <p>{task.description}</p>
            </div>
            <div className="flex justify-between gap-3 h-[30px]">
              <div>
                <span className="font-light">
                  Due: {new Date(task.dueDate!).toDateString()}
                </span>
              </div>
              <div className="flex gap-2 justify-center items-center">
                <button
                  onClick={() => {
                    updateTaskRef.current?.showModal();
                  }}
                  className={`${
                    task.priority === "high"
                      ? "hover:bg-red-400"
                      : task.priority === "medium"
                      ? "hover:bg-yellow-400"
                      : "hover:bg-green-400"
                  } p-2 hover:cursor-pointer hover:fill active:scale-95 rounded-lg px-2`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000000"
                  >
                    <path d="M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z" />
                  </svg>
                </button>
                <button
                  onClick={() => deleteTaskRef.current?.showModal()}
                  className={`${
                    task.priority === "high"
                      ? "hover:bg-red-400"
                      : task.priority === "medium"
                      ? "hover:bg-yellow-400"
                      : "hover:bg-green-400"
                  } p-2  hover:cursor-pointer hover:fill active:scale-95 rounded-lg px-2`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000000"
                    className=""
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDetail;
