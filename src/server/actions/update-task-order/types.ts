import { z } from 'zod';

import { TaskDto } from '@/server/dto/TaskDto';
import { ActionState } from '@/lib/create-safe-action';
import { UpdateTaskOrder } from './schema';

export type InputType = z.infer<typeof UpdateTaskOrder>;
export type ReturnType = ActionState<InputType, TaskDto[]>;
