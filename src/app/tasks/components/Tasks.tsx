'use client';

import React, { useEffect, useState } from 'react';
import SortableList from '@/components/sortable/SortableList';
import TasksContextProvider from '@/lib/tasks-context';
import { TaskDto } from '@/server/dto/TaskDto';
import { createTask } from '@/server/actions/create-task';
import { updateTask } from '@/server/actions/update-task';
import { useDebouncedCallback } from 'use-debounce';
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
    const result = await updateTask({
      id: task.id,
      title: task.title,
      done: task.done
    });

    console.log('result', result);
  }, 750);

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

  const reorder = async (newTasks: TaskDto[]) => {
    setTasks(newTasks);
  };

  const update = (task: TaskDto, index: number) => {
    setTasks(tasks.toSpliced(index, 1, task));
    debounced(task);
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
        <SortableList rows={rows} onChange={setRows} />
      </TasksContextProvider>
    </div>
  );
}

export default Tasks;
