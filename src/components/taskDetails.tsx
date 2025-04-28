import { Priority, Status } from "../types";

function TaskDetail({ task, onEdit, onDelete, onToggleStatus }: any) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case Priority.HIGH:
        return (
          <span className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
            High
          </span>
        );
      case Priority.MEDIUM:
        return (
          <span className="px-2 py-1 text-xs font-medium text-white bg-yellow-500 rounded-full">
            Medium
          </span>
        );
      case Priority.LOW:
        return (
          <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">
            Low
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium text-white bg-gray-500 rounded-full">
            Unknown
          </span>
        );
    }
  };

  const getStatusBadge = (status: Status) => {
    switch (status) {
      case Status.COMPLETED:
        return (
          <span className="px-2 py-1 text-xs font-medium text-white bg-green-500 rounded-full">
            Completed
          </span>
        );

      case Status.INCOMPLETE:
        return (
          <span className="px-2 py-1 text-xs font-medium text-white bg-gray-500 rounded-full">
            Incomplete
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium text-white bg-gray-500 rounded-full">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
          <div className="flex space-x-2">
            {getPriorityBadge(task.priority)}
            {getStatusBadge(task.status)}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-2 text-sm font-medium text-gray-600">
            Description
          </h3>
          <p className="text-gray-700">
            {task.description || "No description provided"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">Due Date</h3>
            <p className="text-gray-700">{formatDate(task.dueDate)}</p>
          </div>

          <div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">Created</h3>
            <p className="text-gray-700">{formatDate(task.createdAt)}</p>
          </div>

          {task.status === Status.COMPLETED && (
            <div>
              <h3 className="mb-1 text-sm font-medium text-gray-600">
                Completed
              </h3>
              <p className="text-gray-700">{formatDate(task.completedAt)}</p>
            </div>
          )}

          <div>
            <h3 className="mb-1 text-sm font-medium text-gray-600">
              Last Updated
            </h3>
            <p className="text-gray-700">{formatDate(task.updatedAt)}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between p-4 bg-gray-50">
        <div>
          <button
            onClick={onDelete}
            className="px-3 py-2 mr-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete
          </button>
          <button
            onClick={onEdit}
            className="px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit
          </button>
        </div>

        <button
          onClick={onToggleStatus}
          className={`px-3 py-2 text-sm font-medium rounded focus:outline-none focus:ring-2 ${
            task.status === Status.COMPLETED
              ? "text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500"
              : "text-white bg-green-500 hover:bg-green-600 focus:ring-green-500"
          }`}
        >
          {task.status === Status.COMPLETED
            ? "Mark as Incomplete"
            : "Mark as Completed"}
        </button>
      </div>
    </div>
  );
}

export default TaskDetail;
