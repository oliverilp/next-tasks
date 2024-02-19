'use client';

import { TaskDto } from '@/server/dto/TaskDto';
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo
} from 'react';

interface TasksContextState {
  tasks: TaskDto[];
  addTask: (title: string, index: number) => Promise<void>;
  reorder: (newRows: number[]) => Promise<void>;
  updateTask: (task: TaskDto, index: number) => void;
}

const TasksContext = createContext<TasksContextState | null>(null);

export default function TasksContextProvider({
  tasks,
  addTask,
  reorder,
  updateTask,
  children
}: PropsWithChildren<TasksContextState>) {
  const context = useMemo(
    () => ({
      tasks,
      addTask,
      reorder,
      updateTask
    }),
    [tasks]
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
