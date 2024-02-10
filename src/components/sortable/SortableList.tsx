'use client';

import React, { useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  Active,
  UniqueIdentifier
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
  const { tasks } = useTasksContext();

  const activeItem = tasks.find((task: Task) => task.id === active?.id);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active: startActive }) => {
        setActive(startActive);
      }}
      onDragEnd={({ active: endActive, over }) => {
        if (over && endActive.id !== over.id) {
          const activeIndex = items.findIndex((id) => id === endActive.id);
          const overIndex = items.findIndex((id) => id === over.id);

          onChange(arrayMove(items, activeIndex, overIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
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
        {activeItem ? <Item task={activeItem} /> : null}
      </SortableOverlay>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
