import { useState } from "react";
import { Task, Status } from "../types";

interface TaskItemProps {
  task: Task;
}

function TaskItem({ task }: { task: Task }) {
  return (
    <div
      className={`w-72 h-full ${
        task.priority === "high"
          ? "bg-red-400"
          : task.priority === "medium"
          ? "bg-yellow-400"
          : "bg-green-400"
      } rounded-lg pl-2 shadow-md pb-1 hover:shadow-lg transition-shadow duration-300`}
    >
      <div className="flex flex-col gap-4  h-full p-4 bg-white/70 rounded-lg backdrop-blur-2xl">
        <div className="lex justify-between items-center ">
          <h1 className="flex-1  font-extrabold">{task.title}</h1>
        </div>
        <div className="flex-1  h-full">
          <p className="">{task.description}</p>
          <span>{task.dueDate}</span>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
