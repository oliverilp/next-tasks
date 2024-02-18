'use server';

import { createSafeAction } from '@/lib/create-safe-action';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { CreateTask } from './schema';
import { InputType, ReturnType } from './types';

async function handler(data: InputType): Promise<ReturnType> {
  const { title, index } = data;

  try {
    await prisma.task.updateMany({
      where: {
        order: { gte: index }
      },
      data: {
        order: { increment: 1 }
      }
    });

    const task = await prisma.task.create({
      data: {
        title,
        done: false,
        order: index
      },
      select: {
        id: true,
        title: true,
        done: true,
        order: true
      }
    });

    return { success: true, data: task };
  } catch (error) {
    return { success: false, error: 'Failed to save to database.' };
  } finally {
    revalidatePath('/');
  }
}

export const createTask = createSafeAction(CreateTask, handler);
