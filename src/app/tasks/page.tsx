import * as React from 'react';
import NoSsrWrapper from '@/components/NoSsrWrapper';
import Tasks from '@/app/tasks/components/Tasks';
import { getTasksList } from '@/server/data/get-tasks-list';

export default async function TasksPage() {
  const tasks = await getTasksList();

  return (
    <div className="flex w-full justify-center">
      <div className="w-[600px] pt-3">
        {tasks.data && (
          <NoSsrWrapper>
            <Tasks items={tasks.data} />
          </NoSsrWrapper>
        )}
      </div>
    </div>
  );
}
