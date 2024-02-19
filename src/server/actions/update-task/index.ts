'use server';

import { createSafeAction } from '@/lib/create-safe-action';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { UpdateTask } from './schema';
import { InputType, ReturnType } from './types';

async function handler(data: InputType): Promise<ReturnType> {
  const { id, ...values } = data;

  try {
    const task = await prisma.task.update({
      where: {
        id
      },
      data: {
        ...values
      }
    });

    return { success: true, data: task };
  } catch (error) {
    return { success: false, error: 'Failed to update task.' };
  } finally {
    revalidatePath('/');
  }
}

export const updateTask = createSafeAction(UpdateTask, handler);
