import React, { forwardRef } from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { InlineInput } from '@/components/ui/InlineInput';

const Item = forwardRef(
  ({ item, changeStatus, changeText, children, ...props }: any, ref) => {
    // console.log('item prop', item);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const x = 'adsasd';

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
            defaultChecked={item?.done ?? false}
          />
          <InlineInput
            onChange={changeText}
            placeholder="No Title"
            defaultValue={item?.value ?? ''}
            className="border-t border-gray-100 group-first:border-t-0"
          />
        </div>
      </li>
    );
  }
);
Item.displayName = 'Item';

export default Item;
