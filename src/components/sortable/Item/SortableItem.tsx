'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  CSSProperties,
  PropsWithChildren
} from 'react';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { GripVertical } from 'lucide-react';
import { Task } from '@/lib/tasks-context';
import Item from './Item';

interface Props {
  item: Task;
}

interface Context {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
}

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {}
});

export function SortableItem({ children, item }: PropsWithChildren<Props>) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition
  } = useSortable({ id: item.id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef
    }),
    [attributes, listeners, setActivatorNodeRef]
  );
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition
  };

  const changeStatus = (event: any) => {
    if (!(window as any).tasks) {
      console.log('status: missing tasks');
      return;
    }
    const { tasks } = window as any;
    const index = tasks.findIndex((task: Task) => task.id === item.id);
    const task = tasks.at(index);
    if (index < 0) return;
    const newTask = { ...task, done: event };
    tasks.splice(index, 1, newTask);
    console.log('status', tasks);
  };

  const changeText = (event: any) => {
    if (!(window as any).tasks) {
      console.log('text: missing tasks');
      return;
    }
    const { tasks } = window as any;
    const index = tasks.findIndex((task: Task) => task.id === item.id);
    const task = tasks.at(index);
    const newTask = { ...task, value: event.target.value };
    tasks.splice(index, 1, newTask);
    console.log('text', tasks);
  };

  return (
    <SortableItemContext.Provider value={context}>
      <Item
        changeStatus={changeStatus}
        changeText={changeText}
        ref={setNodeRef}
        style={style}
      >
        {children}
      </Item>
    </SortableItemContext.Provider>
  );
}

export function DragHandle() {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <button
      {...attributes}
      {...listeners}
      ref={ref}
      type="button"
      tabIndex={-1}
    >
      <GripVertical className="invisible w-4 cursor-grab text-slate-400 active:cursor-grabbing group-hover:visible" />
    </button>
  );
}
