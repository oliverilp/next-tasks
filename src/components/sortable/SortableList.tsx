'use client';

import React, { useMemo, useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  Active
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates
} from '@dnd-kit/sortable';

import { Task } from '@/lib/tasks-context';
import { DragHandle, SortableItem } from './Item/SortableItem';
import { SortableOverlay } from './Overlay/SortableOverlay';
import Item from './Item/Item';

// interface BaseItem {
//   id: UniqueIdentifier;
// }

interface Props {
  items: Task[];
  onChange(items: Task[]): void;
}

export default function SortableList({ items, onChange }: Props) {
  const [active, setActive] = useState<Active | null>(null);
  const activeItem = useMemo((): Task => {
    const { tasks } = window as any;
    return tasks.find((task: Task) => task.id === active?.id);
  }, [active, items]);
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
          const activeIndex = items.findIndex(({ id }) => id === endActive.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);

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
          {items.map((item) => (
            <React.Fragment key={item.id}>
              <SortableList.Item item={item}>
                <SortableList.DragHandle />
              </SortableList.Item>
            </React.Fragment>
          ))}
        </ul>
      </SortableContext>
      <SortableOverlay>
        {activeItem ? <Item item={activeItem} /> : null}
      </SortableOverlay>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
