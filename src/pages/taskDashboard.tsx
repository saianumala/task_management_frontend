import { useState, useEffect } from "react";

import { Task, User, Status } from "../types";
import TaskItem from "../components/taskItem";
import TaskDetail from "../components/taskDetails";
import TaskForm from "../components/taskForm";
import { useRecoilState } from "recoil";
import { taskAtom, tasksAtom } from "../recoil/atoms";
import { useAuth } from "../customHooks/useAuth";
import { useNavigate } from "react-router-dom";

function TaskDashboard() {
  const [tasks, setTasks] = useRecoilState(tasksAtom);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [selectedTask, setSelectedTask] = useRecoilState(taskAtom);
  const [showTaskForm, setShowTaskForm] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
      return;
    }
  }, []);
  useEffect(() => {
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
        setTasks(data);
        console.log(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (
    taskData: Omit<
      Task,
      "id" | "status" | "userId" | "createdAt" | "updatedAt" | "completedAt"
    >
  ) => {
    setIsLoading(true);

    try {
      // In a real app, you would send a POST request to your API
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
      if (!response.ok)
        throw new Error(data.message || "Failed to create task");

      // Simulating API response
      const userString = localStorage.getItem("user");
      const user: User = userString
        ? JSON.parse(userString)
        : { userId: "123" };

      const newTask: Task = {
        ...taskData,
        id: Math.random().toString(36).substring(2, 9),
        status: Status.INCOMPLETE,
        priority: taskData.priority || "low",
        userId: user.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTasks((prevTasks) =>
        prevTasks ? [...prevTasks, newTask] : [newTask]
      );
      setSelectedTask(newTask);
      setShowTaskForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (updatedTask: Task) => {
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

      setTasks(
        (prevTasks) =>
          prevTasks &&
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
      );
      setEditTask(null);
      setSelectedTask(updatedTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKENDURL}/api/task/delete/${id}`,
        {
          credentials: "include",
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete task");
      }

      setTasks(tasks && tasks.filter((task) => task.id !== id));
      if (selectedTask && selectedTask.id === id) {
        setSelectedTask(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskStatus = async (id: string) => {
    const task = tasks && tasks.find((t) => t.id === id);
    if (!task) return;

    const newStatus =
      task.status === Status.COMPLETED ? Status.INCOMPLETE : Status.COMPLETED;

    console.log("newStatus", newStatus);

    const updatedTask: Task = {
      ...task,
      status: newStatus,
      completedAt:
        newStatus === Status.COMPLETED ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    };
    console.log("updatedTask", updatedTask);
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

      setTasks(
        (prevTasks) =>
          prevTasks &&
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
      );

      if (selectedTask && selectedTask.id === id) {
        setSelectedTask(updatedTask);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update task status"
      );
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleEditClick = (task: Task) => {
    setEditTask(task);
    setShowTaskForm(true);
    setSelectedTask(null);
  };
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
  };

  const filteredTasks =
    tasks &&
    tasks.filter((task) => {
      if (filter === "active") return task.status !== Status.COMPLETED;
      if (filter === "completed") return task.status === Status.COMPLETED;
      return true;
    });

  const userString = localStorage.getItem("user");
  const user: User = userString ? JSON.parse(userString) : { email: "User" };

  return (
    <div className="flex flex-col min-h-screen">
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div>
          <header className="bg-white shadow">
            <div className="flex items-center justify-between px-6 py-4 mx-auto">
              <div className="text-2xl font-bold text-blue-600">TaskMaster</div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Hello, {user.fullName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <div className="flex flex-1 h-[calc(100vh-4rem)]">
            <div className="flex flex-col w-80 bg-white border-r border-gray-200">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  My Tasks
                </h2>
                <button
                  onClick={() => {
                    setShowTaskForm(true);
                    setEditTask(null);
                    setSelectedTask(null);
                  }}
                  className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Add Task
                </button>
              </div>

              <div className="flex p-2 border-b border-gray-200">
                <button
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded ${
                    filter === "all"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={`flex-1 px-3 py-2 mx-2 text-sm font-medium rounded ${
                    filter === "active"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setFilter("active")}
                >
                  Active
                </button>
                <button
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded ${
                    filter === "completed"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setFilter("completed")}
                >
                  Completed
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : error ? (
                  <div className="p-4 m-2 text-red-700 bg-red-100 rounded">
                    <p>{error}</p>
                    <button
                      onClick={() => setError("")}
                      className="px-2 py-1 mt-2 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      Dismiss
                    </button>
                  </div>
                ) : filteredTasks && filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onClick={() => handleTaskClick(task)}
                      onToggleComplete={() => toggleTaskStatus(task.id)}
                      isSelected={
                        selectedTask ? selectedTask.id === task.id : false
                      }
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No tasks found</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
              {isLoading && showTaskForm ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : selectedTask ? (
                <TaskDetail
                  task={selectedTask}
                  onEdit={() => handleEditClick(selectedTask)}
                  onDelete={() => deleteTask(selectedTask.id)}
                  onToggleStatus={() => toggleTaskStatus(selectedTask.id)}
                />
              ) : showTaskForm ? (
                <TaskForm
                  onSubmit={editTask ? updateTask : addTask}
                  onCancel={() => {
                    setShowTaskForm(false);
                    setEditTask(null);
                  }}
                  task={editTask}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-600">
                  <h3 className="text-xl font-semibold">
                    Select a task or create a new one
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Click on a task to view details or use the Add Task button
                    to create a new task
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDashboard;
