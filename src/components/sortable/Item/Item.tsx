import React, { forwardRef } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { InlineInput } from '@/components/ui/InlineInput';
import { Task } from '@/lib/tasks-context';

interface Props {
  task?: Task;
  [key: string]: any;
}

const Item = forwardRef(
  ({ task, changeStatus, changeText, children, ...props }: Props, ref: any) => {
    const { done, value } = task ?? {};

    return (
      <li
        className="group flex list-none items-center gap-1"
        ref={ref}
        {...props}
      >
        {children}
        <div className="flex grow items-center gap-2 rounded-md px-4 group-hover:bg-slate-50 has-[:focus]:bg-blue-50 group-hover:has-[:focus]:bg-blue-50">
          <Checkbox
            onCheckedChange={changeStatus}
            defaultChecked={done ?? false}
          />
          <InlineInput
            onChange={changeText}
            placeholder="No Title"
            defaultValue={value ?? ''}
            className="border-t border-gray-100 group-first:border-t-0"
          />
        </div>
      </li>
    );
  }
);
Item.displayName = 'Item';
Item.defaultProps = { task: {} };

export default Item;
