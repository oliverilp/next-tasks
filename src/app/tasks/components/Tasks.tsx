'use client';

import React, { useMemo, useRef } from 'react';
import SortableList from '@/components/sortable/SortableList';
import TasksContextProvider from '@/lib/use-tasks-context';
import { TaskDto } from '@/server/dto/TaskDto';
import { createTask } from '@/server/actions/create-task';
import { updateTask } from '@/server/actions/update-task';
import { useDebouncedCallback } from 'use-debounce';
import { updateTaskOrder } from '@/server/actions/update-task-order';
import { useOptimistic } from '@/lib/use-optimistic';
import AddTask from './AddTask';

interface Props {
  items: TaskDto[];
}

function Tasks({ items }: Props) {
  const [tasks, setTasks] = useOptimistic(items);
  const cachedRows = useMemo(() => items.map(({ id }) => id), [items]);
  const [rows, setRows] = useOptimistic<number[]>(cachedRows);
  const pendingUpdates = useRef<Map<number, TaskDto>>(new Map());

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
        reorderTasks={reorder}
        updateTask={update}
      >
        <AddTask />
        <SortableList rows={rows} />
      </TasksContextProvider>
    </div>
  );
}

export default Tasks;
