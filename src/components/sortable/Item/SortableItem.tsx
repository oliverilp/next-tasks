'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  CSSProperties,
  PropsWithChildren
} from 'react';
import type {
  DraggableSyntheticListeners,
  UniqueIdentifier
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Checkbox } from '@/components/ui/Checkbox';
import { InlineInput } from '@/components/ui/InlineInput';

import { GripVertical } from 'lucide-react';

interface Props {
  id: UniqueIdentifier;
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
    transform,
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
    transform: CSS.Translate.toString(transform),
    transition
  };

  return (
    <SortableItemContext.Provider value={context}>
      <li
        className="group flex list-none items-center gap-1"
        ref={setNodeRef}
        style={style}
      >
        {children}
        <div className="flex grow items-center gap-2 rounded-md px-4 group-hover:bg-slate-50 has-[:focus]:bg-blue-50 group-hover:has-[:focus]:bg-blue-50">
          <Checkbox />
          <InlineInput
            placeholder="No Title"
            className="border-t border-gray-100 group-first:border-t-0"
          />
        </div>
      </li>
      {/* <li
        className="flex flex-grow list-none items-center justify-between rounded-md bg-white px-5 py-3 font-sans font-normal shadow"
        ref={setNodeRef}
        style={style}
      >
        {children}
      </li> */}
    </SortableItemContext.Provider>
  );
}

export function DragHandle() {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <button {...attributes} {...listeners} ref={ref} type="button">
      <GripVertical className="invisible w-4 cursor-grab text-slate-400 active:cursor-grabbing group-hover:visible" />
    </button>
  );
}
