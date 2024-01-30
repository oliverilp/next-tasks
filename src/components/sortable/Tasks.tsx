import React, { useState } from 'react';
import SortableList from '@/components/sortable/Sortable';

function createRange<T>(
  length: number,
  initializer: (index: number) => T
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}

function getMockItems() {
  return createRange(50, (index) => ({ id: index + 1 }));
}

function Tasks() {
  const [items, setItems] = useState(getMockItems);

  return (
    <div className="flex-grow">
      <SortableList
        items={items}
        onChange={setItems}
        renderItem={(item) => (
          <SortableList.Item id={item.id}>
            {item.id}
            <SortableList.DragHandle />
          </SortableList.Item>
        )}
      />
    </div>
  );
}

export default Tasks;
