export type Category = {
  id: string;
  name: string;
  color: string;
};

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  categoryId: string;
  status: TaskStatus;
  assignedTo: string | null; // User ID for team tasks, null for personal
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};