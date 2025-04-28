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
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowSidebar(true);
        if (selectedTask || showTaskForm) {
          setShowSidebar(false);
        }
      } else {
        setShowSidebar(true);
      }
    };

    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    return () => window.removeEventListener("resize", checkMobileView);
  }, [selectedTask, showTaskForm]);

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

      const newTask: Task = {
        ...taskData,
        id: Math.random().toString(36).substring(2, 9),
        status: Status.INCOMPLETE,
        priority: taskData.priority || "low",
        userId: user.userId,
        createdAt: new Date().toISOString(),
      };

      setTasks((prevTasks) =>
        prevTasks ? [...prevTasks, newTask] : [newTask]
      );
      setSelectedTask(newTask);
      setShowTaskForm(false);
      if (isMobileView) {
        setShowSidebar(false);
      }
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
      if (isMobileView) {
        setShowSidebar(false);
      }
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
        if (isMobileView) {
          setShowSidebar(true);
        }
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
    if (isMobileView) {
      setShowSidebar(false);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditTask(task);
    setShowTaskForm(true);
    setSelectedTask(null);
    if (isMobileView) {
      setShowSidebar(false);
    }
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
    navigate("/login");
  };

  const handleBackToList = () => {
    setSelectedTask(null);
    setShowTaskForm(false);
    setShowSidebar(true);
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
      {isLoading && !showTaskForm && !selectedTask ? (
        <div className="flex items-center justify-center h-screen">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-col h-screen">
          <header className="bg-white shadow">
            <div className="flex flex-wrap items-center justify-between px-4 py-3 mx-auto sm:px-6">
              <div className="flex items-center">
                <div className="text-xl font-bold text-blue-600 sm:text-2xl">
                  TaskMaster
                </div>
              </div>
              <div className="flex items-center mt-2 space-x-2 sm:mt-0 sm:space-x-4">
                <span className="text-sm text-gray-700 truncate sm:text-base">
                  Hello, {user.fullName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-2 py-1 text-xs text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded sm:px-3 sm:text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Task List Sidebar */}
            {(showSidebar || !isMobileView) && (
              <div
                className={`flex flex-col bg-white border-r border-gray-200 ${
                  isMobileView ? "w-full" : "w-80"
                }`}
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">
                    My Tasks
                  </h2>
                  <button
                    onClick={() => {
                      setShowTaskForm(true);
                      setEditTask(null);
                      setSelectedTask(null);
                      if (isMobileView) {
                        setShowSidebar(false);
                      }
                    }}
                    className="px-2 py-1 text-xs text-white bg-blue-500 rounded hover:bg-blue-600 sm:px-3 sm:text-sm"
                  >
                    Add Task
                  </button>
                </div>

                <div className="flex p-2 border-b border-gray-200">
                  <button
                    className={`flex-1 px-2 py-2 text-xs font-medium rounded sm:px-3 sm:text-sm ${
                      filter === "all"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setFilter("all")}
                  >
                    All
                  </button>
                  <button
                    className={`flex-1 px-2 py-2 mx-1 text-xs font-medium rounded sm:px-3 sm:mx-2 sm:text-sm ${
                      filter === "active"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setFilter("active")}
                  >
                    Active
                  </button>
                  <button
                    className={`flex-1 px-2 py-2 text-xs font-medium rounded sm:px-3 sm:text-sm ${
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
                    <div className="p-3 m-2 text-sm text-red-700 bg-red-100 rounded sm:p-4">
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
            )}

            {/* Task Detail/Form Area */}
            {(!showSidebar || !isMobileView) && (
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 sm:p-6">
                {isMobileView && (
                  <button
                    onClick={handleBackToList}
                    className="flex items-center mb-4 text-sm text-blue-500 hover:text-blue-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Back to task list
                  </button>
                )}

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
                      if (isMobileView) {
                        setShowSidebar(true);
                      }
                    }}
                    task={editTask}
                  />
                ) : (
                  !isMobileView && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-600">
                      <h3 className="text-lg font-semibold text-center sm:text-xl">
                        Select a task or create a new one
                      </h3>
                      <p className="mt-2 text-sm text-center text-gray-500 sm:text-base">
                        Click on a task to view details or use the Add Task
                        button to create a new task
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDashboard;
