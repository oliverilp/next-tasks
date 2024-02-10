'use client';

import React, { useState } from 'react';
import SortableList from '@/components/sortable/SortableList';
import TasksContextProvider, { Task } from '@/lib/tasks-context';
import { UniqueIdentifier } from '@dnd-kit/core';

function createRange<T>(
  length: number,
  initializer: (index: number) => T
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}

function getMockTasks() {
  return createRange<Task>(10, (index) => ({
    id: index + 1,
    value: `${index + 1}`,
    done: false
  }));
}

function getMockItems(): UniqueIdentifier[] {
  return createRange(10, (index) => index + 1);
}

const tasks = getMockTasks();

function Tasks() {
  const [items, setItems] = useState(getMockItems);

  return (
    <div className="flex-grow">
      <TasksContextProvider items={tasks}>
        <SortableList items={items} onChange={setItems} />
      </TasksContextProvider>
    </div>
  );
}

export default Tasks;
