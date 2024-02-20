'use client';

import React, { useEffect, useRef, useState } from 'react';
import SortableList from '@/components/sortable/SortableList';
import TasksContextProvider from '@/lib/tasks-context';
import { TaskDto } from '@/server/dto/TaskDto';
import { createTask } from '@/server/actions/create-task';
import { updateTask } from '@/server/actions/update-task';
import { useDebouncedCallback } from 'use-debounce';
import { updateTaskOrder } from '@/server/actions/update-task-order';
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
  const pendingUpdates = useRef<Map<number, TaskDto>>(new Map());

  useEffect(() => {
    setTasks(items);
    setRows(getRows(items));
    console.log('useEffect', items);
  }, [items]);

  const debounced = useDebouncedCallback(async () => {
    const promises = Array.from(pendingUpdates.current.values()).map(
      (task: TaskDto) => updateTask(task)
    );
    await Promise.all(promises);
    pendingUpdates.current.clear();
  }, 1000);

  const add = async (title: string, index = 0) => {
    const fakeId = -tasks.length;
    const task = {
      id: fakeId,
      title,
      done: false,
      order: index
    };
    setTasks([task, ...tasks]);
    setRows([fakeId, ...rows]);

    await createTask({ title, order: index });
  };

  const reorder = async (newRows: number[]) => {
    setRows(newRows);

    const newTasks = tasks
      .slice()
      .sort((a, b) => newRows.indexOf(a.id) - newRows.indexOf(b.id))
      .map((item, i) => ({ ...item, order: i }));
    setTasks(newTasks);

    await updateTaskOrder({ items: newTasks });
  };

  const update = (task: TaskDto, index: number) => {
    setTasks(tasks.toSpliced(index, 1, task));

    pendingUpdates.current.set(task.id, task);
    void debounced();
  };

  return (
    <div className="flex-grow">
      <TasksContextProvider
        tasks={tasks}
        addTask={add}
        reorder={reorder}
        updateTask={update}
      >
        <AddTask />
        <SortableList rows={rows} />
      </TasksContextProvider>
    </div>
  );
}

export default Tasks;
