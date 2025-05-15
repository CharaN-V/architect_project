import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Category, User, TaskStatus } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialTasks, initialCategories, initialUsers } from '../data/initialData';

interface TaskContextType {
  tasks: Task[];
  categories: Category[];
  users: User[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  getTasksByCategory: (categoryId: string) => Task[];
  getTasksByStatus: (status: TaskStatus) => Task[];
  getCategoryById: (id: string) => Category | undefined;
  getUserById: (id: string) => User | undefined;
  getCompletedTasksCount: () => number;
  getPendingTasksCount: () => number;
  getInProgressTasksCount: () => number;
  getOverdueTasksCount: () => number;
  getTotalTasksCount: () => number;
  getTaskCompletionRate: () => number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskflow-tasks', initialTasks);
  const [categories, setCategories] = useLocalStorage<Category[]>('taskflow-categories', initialCategories);
  const [users] = useLocalStorage<User[]>('taskflow-users', initialUsers);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, ...updatedTask, updatedAt: new Date().toISOString() }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    updateTask(id, { status });
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  const getTasksByCategory = (categoryId: string) => {
    return tasks.filter((task) => task.categoryId === categoryId);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const getCategoryById = (id: string) => {
    return categories.find((category) => category.id === id);
  };

  const getUserById = (id: string) => {
    return users.find((user) => user.id === id);
  };

  const getCompletedTasksCount = () => {
    return tasks.filter((task) => task.status === 'completed').length;
  };

  const getPendingTasksCount = () => {
    return tasks.filter((task) => task.status === 'pending').length;
  };

  const getInProgressTasksCount = () => {
    return tasks.filter((task) => task.status === 'in-progress').length;
  };

  const getOverdueTasksCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(
      (task) => 
        task.status !== 'completed' && 
        new Date(task.dueDate) < today
    ).length;
  };

  const getTotalTasksCount = () => {
    return tasks.length;
  };

  const getTaskCompletionRate = () => {
    if (tasks.length === 0) return 0;
    return (getCompletedTasksCount() / tasks.length) * 100;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        categories,
        users,
        addTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        addCategory,
        deleteCategory,
        getTasksByCategory,
        getTasksByStatus,
        getCategoryById,
        getUserById,
        getCompletedTasksCount,
        getPendingTasksCount,
        getInProgressTasksCount,
        getOverdueTasksCount,
        getTotalTasksCount,
        getTaskCompletionRate,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};