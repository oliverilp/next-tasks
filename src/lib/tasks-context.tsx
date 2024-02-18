'use client';

import { TaskDto } from '@/server/dto/TaskDto';
import React, { createContext, useContext, useMemo } from 'react';

interface TasksContextProviderProps {
  tasks: TaskDto[];
  setTasks: React.Dispatch<React.SetStateAction<TaskDto[]>>;
  children: React.ReactNode;
}

interface TasksContextState {
  tasks: TaskDto[];
  setTasks: React.Dispatch<React.SetStateAction<TaskDto[]>>;
}

const TasksContext = createContext<TasksContextState | null>(null);

export default function TasksContextProvider({
  tasks,
  setTasks,
  children
}: TasksContextProviderProps) {
  const context = useMemo(
    () => ({
      tasks,
      setTasks
    }),
    [tasks, setTasks]
  );

  return (
    <TasksContext.Provider value={context}>{children}</TasksContext.Provider>
  );
}

export function useTasksContext() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error(
      'useTasksContext must be used within a TasksContextProvider'
    );
  }

  return context;
}
