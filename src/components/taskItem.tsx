import { Task, Status } from "../types";

interface TaskItemProps {
  task: Task;
  onClick: () => void;
  onToggleComplete: () => void;
  isSelected: boolean;
}

function TaskItem({
  task,
  onClick,
  onToggleComplete,
  isSelected,
}: TaskItemProps) {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPriorityBadge = () => {
    switch (task.priority) {
      case "high":
        return (
          <span className="px-2 py-1 text-xs text-white bg-red-500 rounded-full">
            High
          </span>
        );
      case "medium":
        return (
          <span className="px-2 py-1 text-xs text-white bg-yellow-500 rounded-full">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs text-white bg-green-500 rounded-full">
            Low
          </span>
        );
    }
  };

  const getStatusClasses = () => {
    if (task.status === Status.COMPLETED) {
      return "text-gray-500 line-through";
    }
    if (task.status === Status.IN_PROGRESS) {
      return "text-blue-600";
    }
    return "";
  };

  return (
    <div
      className={`flex p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}`}
      onClick={onClick}
    >
      <input
        type="checkbox"
        checked={task.status === Status.COMPLETED}
        onChange={() => {}}
        onClick={handleCheckboxClick}
        className="mr-3 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`text-base font-medium ${getStatusClasses()}`}>
            {task.title}
          </h3>
          {getPriorityBadge()}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Due: {formatDate(task.dueDate)}
          </p>
          <span className="text-xs">
            {task.status === Status.IN_PROGRESS ? "In Progress" : task.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
