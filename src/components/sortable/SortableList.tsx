'use client';

import React, { useEffect, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  Active,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';

import { useTasksContext } from '@/lib/tasks-context';
import { TaskDto } from '@/server/dto/TaskDto';
import { DragHandle, SortableItem } from './Item/SortableItem';
import { SortableOverlay } from './Overlay/SortableOverlay';
import Item from './Item/Item';

interface Props {
  rows: number[];
  onChange(rows: number[]): void;
}

export default function SortableList({ rows, onChange }: Props) {
  const [active, setActive] = useState<Active | null>(null);
  const { tasks, reorder } = useTasksContext();

  const activeItem = tasks.find((task: TaskDto) => task.id === active?.id);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  useEffect(() => {
    const newTasks = tasks
      .slice()
      .sort((a, b) => rows.indexOf(a.id) - rows.indexOf(b.id))
      .map((item, i) => ({ ...item, order: i }));
    reorder(newTasks);
  }, [rows]);

  const onDragStart = ({ active: startActive }: DragStartEvent) => {
    setActive(startActive);
  };

  const onDragEnd = ({ active: endActive, over }: DragEndEvent) => {
    if (over && endActive.id !== over.id) {
      const activeIndex = rows.findIndex((id) => id === endActive.id);
      const overIndex = rows.findIndex((id) => id === over.id);

      onChange(arrayMove(rows, activeIndex, overIndex));
    }
    setActive(null);
  };

  const onDragCancel = () => {
    setActive(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <SortableContext items={rows}>
        <ul className="flex list-none flex-col p-0" role="application">
          {rows.map((id) => (
            <React.Fragment key={id}>
              <SortableList.Item id={id}>
                <SortableList.DragHandle />
              </SortableList.Item>
            </React.Fragment>
          ))}
        </ul>
      </SortableContext>
      <SortableOverlay>
        {activeItem ? (
          <Item
            task={activeItem}
            className="cursor-grabbing opacity-50 shadow-lg"
          />
        ) : null}
      </SortableOverlay>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
