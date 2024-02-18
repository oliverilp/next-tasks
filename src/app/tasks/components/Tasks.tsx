'use client';

import React, { useEffect, useState } from 'react';
import SortableList from '@/components/sortable/SortableList';
import TasksContextProvider from '@/lib/tasks-context';
import { TaskDto } from '@/server/dto/TaskDto';
import { createTask } from '@/server/actions/create-task';
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

  const addTask = async (title: string, index = 0) => {
    const fakeId = -tasks.length;
    const task = {
      id: fakeId,
      title,
      done: false,
      order: index
    };
    setTasks([task, ...tasks]);
    setRows([fakeId, ...rows]);

    const result = await createTask({ title, order: index });
    console.log('result', result);
  };

  const reorder = (newTasks: TaskDto[]) => {
    setTasks(newTasks);
  };

  const updateTask = (task: TaskDto, index: number) => {
    setTasks(tasks.toSpliced(index, 1, task));
  };

  return (
    <div className="flex-grow">
      <TasksContextProvider
        tasks={tasks}
        addTask={addTask}
        reorder={reorder}
        updateTask={updateTask}
      >
        <AddTask />
        <SortableList rows={rows} onChange={setRows} />
      </TasksContextProvider>
    </div>
  );
}

export default Tasks;
