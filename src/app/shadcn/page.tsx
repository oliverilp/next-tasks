'use client';

import * as React from 'react';
import NoSsrWrapper from '@/components/NoSsrWrapper';
import Tasks from '@/components/sortable/Tasks';

export default function CardWithForm() {
  return (
    <div className="flex w-full justify-center">
      <div className="w-[450px] pt-2">
        <NoSsrWrapper>
          <Tasks />
        </NoSsrWrapper>
      </div>
    </div>
  );
}
