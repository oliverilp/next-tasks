'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  CSSProperties,
  PropsWithChildren,
  useState
} from 'react';
import { useDndMonitor, type DraggableSyntheticListeners } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';

import { GripVertical } from 'lucide-react';
import { useTasksContext } from '@/lib/tasks-context';
import { TaskDto } from '@/server/dto/TaskDto';
import Item from './Item';
import Indicator from './Indicator';

enum Position {
  Before,
  After,
  None
}

interface Props {
  id: number;
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

export function SortableItem({ children, id }: PropsWithChildren<Props>) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transition
  } = useSortable({ id });

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
    transition
  };
  const [indicatorPosition, setIndicatorPosition] = useState<Position>(
    Position.None
  );

  const { tasks, updateTask } = useTasksContext();
  const index = tasks.findIndex((task: TaskDto) => task.id === id);
  const task = tasks.at(index);

  useDndMonitor({
    onDragOver({ active, over }) {
      if (over?.id !== id) {
        setIndicatorPosition(Position.None);
        return;
      }
      const activeIndex = tasks.findIndex((item) => item.id === active.id);
      setIndicatorPosition(
        index <= activeIndex ? Position.Before : Position.After
      );
    },
    onDragEnd() {
      setIndicatorPosition(Position.None);
    },
    onDragCancel() {
      setIndicatorPosition(Position.None);
    }
  });

  const changeStatus = (done: boolean) => {
    if (index < 0 || !task) return;
    const newTask = { ...task, done };
    updateTask(newTask, index);
  };

  const changeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (index < 0 || !task) return;
    const newTask = { ...task, title: event.target.value };
    updateTask(newTask, index);
  };

  return (
    <SortableItemContext.Provider value={context}>
      {indicatorPosition === Position.Before && <Indicator />}
      <Item
        task={task}
        changeStatus={changeStatus}
        changeText={changeText}
        ref={setNodeRef}
        style={style}
      >
        {children}
      </Item>
      {indicatorPosition === Position.After && <Indicator />}
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
