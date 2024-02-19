import { z } from 'zod';

export const UpdateTask = z.object({
  id: z.number().nonnegative().finite().safe(),
  title: z.string(),
  done: z.boolean(),
  order: z.number().nonnegative().finite().safe()
});
