'use client';

import { UniqueIdentifier } from '@dnd-kit/core';
import React, { createContext, useContext, useMemo, useState } from 'react';

export interface Task {
  id: UniqueIdentifier;
  value: string;
  done: boolean;
}

interface TasksContextProviderProps {
  items: Task[];
  children: React.ReactNode;
}

interface TasksContextState {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TasksContext = createContext<TasksContextState | null>(null);

export default function TasksContextProvider({
  items,
  children
}: TasksContextProviderProps) {
  const [tasks, setTasks] = useState<Task[]>(items);

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
