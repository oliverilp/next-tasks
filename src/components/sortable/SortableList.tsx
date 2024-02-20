'use client';

import React, { useState } from 'react';
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

import { useTasksContext } from '@/lib/use-tasks-context';
import { TaskDto } from '@/server/dto/TaskDto';
import { DragHandle, SortableItem } from './Item/SortableItem';
import { SortableOverlay } from './Overlay/SortableOverlay';
import Item from './Item/Item';

interface Props {
  rows: number[];
}

export default function SortableList({ rows }: Props) {
  const [active, setActive] = useState<Active | null>(null);
  const { tasks, reorder } = useTasksContext();

  const activeItem = tasks.find((task: TaskDto) => task.id === active?.id);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const onDragStart = ({ active: startActive }: DragStartEvent) => {
    setActive(startActive);
  };

  const onDragEnd = ({ active: endActive, over }: DragEndEvent) => {
    if (over && endActive.id !== over.id) {
      const activeIndex = rows.findIndex((id) => id === endActive.id);
      const overIndex = rows.findIndex((id) => id === over.id);

      void reorder(arrayMove(rows, activeIndex, overIndex));
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
