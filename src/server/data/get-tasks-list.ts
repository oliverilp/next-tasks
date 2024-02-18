'use server';

import { prisma } from '@/lib/prisma';
import { TaskDto } from '../dto/TaskDto';

export interface ReturnType {
  success: boolean;
  data?: TaskDto[];
  error?: string;
}

export async function getTasksList(): Promise<ReturnType> {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        order: 'asc'
      },
      select: {
        id: true,
        title: true,
        done: true,
        order: true
      }
    });

    return { success: true, data: tasks };
  } catch (error) {
    return { success: false, error: 'Failed to get tasks.' };
  }
}
