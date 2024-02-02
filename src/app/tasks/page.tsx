import * as React from 'react';

import { Checkbox } from '@/components/ui/Checkbox';
import { InlineInput } from '@/components/ui/InlineInput';

import { GripVertical } from 'lucide-react';

function Task() {
  return (
    <li className="flex list-none items-center gap-1">
      <GripVertical className="w-4 cursor-grab text-slate-400 active:cursor-grabbing" />
      <div className="flex grow items-center gap-2 rounded-md px-4 has-[:focus]:bg-indigo-50">
        <Checkbox />
        <InlineInput placeholder="No Title" />
      </div>
    </li>
  );
}

export default function List() {
  return (
    <ul className="flex w-full justify-center pt-2">
      <div className="flex w-[500px] flex-col">
        {[1, 2, 3].map((item) => (
          <Task key={item} />
        ))}
      </div>
    </ul>
  );
}
