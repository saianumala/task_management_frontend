import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Task, Priority, Status } from "../types";

interface TaskFormProps {
  onSubmit: (task: any) => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  task?: Task | null;
}

type FormValues = {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  status?: Status;
};

function TaskForm({ onSubmit, dialogRef, task }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: task?.title || "",
      description: task?.description || "",
      priority: task?.priority || Priority.MEDIUM,
      dueDate: task?.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
      status: task?.status || Status.INCOMPLETE,
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        status: task.status,
      });
    }
  }, [task, reset]);

  const onFormSubmit = (data: FormValues) => {
    const taskData = {
      ...(task && { id: task.id }),
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      ...(task && { userId: task.userId }),
      ...(task && { createdAt: task.createdAt }),
      ...(data.status === Status.COMPLETED && {
        completedAt: task?.completedAt || new Date().toISOString(),
      }),
    };

    onSubmit(taskData);
  };

  return (
    <div className="p-6 w-full h-full rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        {task ? "Edit Task" : "Create New Task"}
      </h2>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            {...register("title", {
              required: "Title is required",
              maxLength: {
                value: 100,
                message: "Title must be less than 100 characters",
              },
            })}
            className={`block w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter a title for your task"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register("description", {
              maxLength: {
                value: 500,
                message: "Description must be less than 500 characters",
              },
            })}
            rows={4}
            className={`block w-full p-3 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describe your task (optional)"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Priority & Due Date */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
          {/* Priority */}
          <div>
            <label
              htmlFor="priority"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Priority
            </label>
            <select
              id="priority"
              {...register("priority")}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={Priority.LOW}>Low</option>
              <option value={Priority.MEDIUM}>Medium</option>
              <option value={Priority.HIGH}>High</option>
            </select>
          </div>

          {/* Due Date */}
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
              {...register("dueDate")}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status (only for edit) */}
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
                {...register("status")}
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={Status.INCOMPLETE}>Incomplete</option>
                <option value={Status.COMPLETED}>Completed</option>
              </select>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
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
