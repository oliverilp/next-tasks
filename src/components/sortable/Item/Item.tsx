import React, {
  PropsWithChildren,
  forwardRef,
  useEffect,
  useState
} from 'react';
import { Checkbox } from '@/components/ui/Checkbox';
import { InlineInput } from '@/components/ui/InlineInput';
import { cn } from '@/lib/utils';
import { TaskDto } from '@/server/dto/TaskDto';

interface Props extends PropsWithChildren {
  task?: TaskDto;
  changeStatus?: (done: boolean) => void;
  changeText?: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  style?: React.CSSProperties;
}

const Item = forwardRef(
  (
    { task, changeStatus, changeText, className, children, ...props }: Props,
    ref: React.LegacyRef<HTMLLIElement>
  ) => {
    // const { done, title } = task ?? {};
    const [title, setTitle] = useState(task?.title ?? '');
    const [done, setDone] = useState(task?.done ?? false);

    useEffect(() => {
      if (task) {
        setTitle(task.title);
        setDone(task.done);
      }
    }, [task]);

    const onCheckedChange = (newDone: boolean) => {
      setDone(newDone);
      if (changeStatus) {
        changeStatus(newDone);
      }
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
      if (changeText) {
        changeText(event);
      }
    };

    return (
      <li
        className="group flex list-none items-center gap-1"
        ref={ref}
        {...props}
      >
        {children}
        <div
          className={cn(
            'flex grow items-center gap-2 rounded-md px-4 group-hover:bg-slate-50 has-[:focus]:bg-blue-50 group-hover:has-[:focus]:bg-blue-50',
            className
          )}
        >
          <Checkbox onCheckedChange={onCheckedChange} checked={done} />
          <InlineInput
            onChange={onChange}
            placeholder="No Title"
            value={title}
            className="border-t border-gray-100 group-first:border-t-0"
          />
        </div>
      </li>
    );
  }
);
Item.displayName = 'Item';
Item.defaultProps = {
  task: undefined,
  changeStatus: undefined,
  changeText: undefined,
  className: '',
  style: {}
};

export default Item;
