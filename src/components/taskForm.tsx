import { useState, FormEvent, ChangeEvent } from "react";
import { Task, Priority, Status } from "../types";

interface TaskFormProps {
  onSubmit: (task: any) => void;
  onCancel: () => void;
  task?: Task | null;
}

function TaskForm({ onSubmit, onCancel, task }: TaskFormProps) {
  const [title, setTitle] = useState<string>(task?.title || "");
  const [description, setDescription] = useState<string>(
    task?.description || ""
  );
  const [priority, setPriority] = useState<string>(
    task?.priority || Priority.MEDIUM
  );
  const [dueDate, setDueDate] = useState<string>(
    task?.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );
  const [status, setStatus] = useState<Status>(
    task?.status || Status.INCOMPLETE
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const taskData = {
      ...(task && { id: task.id }),
      title,
      description,
      priority,
      status,
      ...(dueDate && { dueDate: new Date(dueDate).toISOString() }),
      ...(task && { userId: task.userId }),
      ...(task && { createdAt: task.createdAt }),
      ...(status === Status.COMPLETED && {
        completedAt: task?.completedAt || new Date().toISOString(),
      }),
    };

    onSubmit(taskData);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        {task ? "Edit Task" : "Create New Task"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            className={`block w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter a title for your task"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            rows={4}
            className={`block w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describe your task (optional)"
          ></textarea>
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="priority"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setPriority(e.target.value)
              }
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={Priority.LOW}>Low</option>
              <option value={Priority.MEDIUM}>Medium</option>
              <option value={Priority.HIGH}>High</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDueDate(e.target.value)
              }
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {task && (
            <div>
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setStatus(e.target.value as Status)
                }
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={Status.INCOMPLETE}>Incomplete</option>
                <option value={Status.COMPLETED}>Completed</option>
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {task ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
