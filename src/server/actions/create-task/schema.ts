import { z } from 'zod';

export const CreateTask = z.object({
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title is required'
  }),
  index: z.number().nonnegative().finite().safe()
});
