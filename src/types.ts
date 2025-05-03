export enum Status {
  INCOMPLETE = "incomplete",
  COMPLETED = "complete",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface User {
  userId: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  userId: string;
  createdAt: string;
  updatedAt?: string;
  dueDate: string;
  completedAt?: string;
}
