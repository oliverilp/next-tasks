'use client';

import React, { useEffect, useState } from 'react';
import SortableList from '@/components/sortable/SortableList';
import TasksContextProvider from '@/lib/tasks-context';
import { TaskDto } from '@/server/dto/TaskDto';
import AddTask from './AddTask';

interface Props {
  items: TaskDto[];
}

function getRows(items: TaskDto[]) {
  return items.map(({ id }) => id);
}

function Tasks({ items }: Props) {
  const [tasks, setTasks] = useState(items);
  const [rows, setRows] = useState(getRows(items));

  useEffect(() => {
    setTasks(items);
    setRows(getRows(items));
  }, [items]);

  return (
    <div className="flex-grow">
      <TasksContextProvider tasks={tasks} setTasks={setTasks}>
        <AddTask />
        <SortableList rows={rows} onChange={setRows} />
      </TasksContextProvider>
    </div>
  );
}

export default Tasks;
