'use server';

import { createSafeAction } from '@/lib/create-safe-action';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { UpdateTaskOrder } from './schema';
import { InputType, ReturnType } from './types';

async function handler(data: InputType): Promise<ReturnType> {
  const { items } = data;

  try {
    const transaction = items.map((task) =>
      prisma.task.update({
        where: {
          id: task.id
        },
        data: {
          order: task.order
        }
      })
    );
    const tasks = await prisma.$transaction(transaction);

    return { success: true, data: tasks };
  } catch (error) {
    return { success: false, error: 'Failed to update task.' };
  } finally {
    revalidatePath('/');
  }
}

export const updateTaskOrder = createSafeAction(UpdateTaskOrder, handler);
