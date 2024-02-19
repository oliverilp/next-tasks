'use client';

import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    setTasks(items);
    setRows(getRows(items));
    // console.log('useEffect', items);
  }, [items]);

  useEffect(() => {
    // console.log('new tasks', tasks);
  }, [tasks]);

  const debounced = useDebouncedCallback(async (task: TaskDto) => {
    const result = await updateTask(task);

    console.log('result', result);
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

    const result = await createTask({ title, order: index });
    console.log('result', result);
  };

  const reorder = async (newRows: number[]) => {
    setRows(newRows);

    const newTasks = tasks
      .slice()
      .sort((a, b) => newRows.indexOf(a.id) - newRows.indexOf(b.id))
      .map((item, i) => ({ ...item, order: i }));
    setTasks(newTasks);

    console.log('reorder');
    console.log(await updateTaskOrder({ items: newTasks }));
  };

  const update = (task: TaskDto, index: number) => {
    console.log('update task', task.id);
    setTasks(tasks.toSpliced(index, 1, task));
    void debounced(task);
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
