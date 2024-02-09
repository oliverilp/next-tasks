'use client';

import React, { useState } from 'react';
import SortableList from '@/components/sortable/SortableList';
import { Task } from '@/lib/tasks-context';

function createRange<T>(
  length: number,
  initializer: (index: number) => T
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}

function getMockTasks() {
  return createRange<Task>(15, (index) => ({
    id: index + 1,
    value: '',
    done: false
  }));
}

// function getMockItems(): number[] {
//   return createRange(15, (index) => index);
// }

function Tasks() {
  const [items, setItems] = useState(getMockTasks);
  const global: Window & { tasks?: Task[] } = window;
  if (!global.tasks) {
    global.tasks = JSON.parse(JSON.stringify(items));
  }

  return (
    <div className="flex-grow">
      <SortableList items={items} onChange={setItems} />
    </div>
  );
}

export default Tasks;
