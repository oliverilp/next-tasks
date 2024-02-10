'use client';

import React, { useEffect, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  Active,
  UniqueIdentifier,
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';

import { Task, useTasksContext } from '@/lib/tasks-context';
import { DragHandle, SortableItem } from './Item/SortableItem';
import { SortableOverlay } from './Overlay/SortableOverlay';
import Item from './Item/Item';

interface Props {
  items: UniqueIdentifier[];
  onChange(items: UniqueIdentifier[]): void;
}

export default function SortableList({ items, onChange }: Props) {
  const [active, setActive] = useState<Active | null>(null);
  const { tasks, setTasks } = useTasksContext();

  const activeItem = tasks.find((task: Task) => task.id === active?.id);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  useEffect(() => {
    setTasks(
      tasks.slice().sort((a, b) => items.indexOf(a.id) - items.indexOf(b.id))
    );
  }, [items]);

  const onDragStart = ({ active: startActive }: DragStartEvent) => {
    setActive(startActive);
  };

  const onDragEnd = ({ active: endActive, over }: DragEndEvent) => {
    if (over && endActive.id !== over.id) {
      const activeIndex = items.findIndex((id) => id === endActive.id);
      const overIndex = items.findIndex((id) => id === over.id);

      onChange(arrayMove(items, activeIndex, overIndex));
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
      <SortableContext items={items}>
        <ul className="flex list-none flex-col p-0" role="application">
          {items.map((id) => (
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
