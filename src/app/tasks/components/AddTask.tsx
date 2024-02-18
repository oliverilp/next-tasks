'use client';

import { Input } from '@/components/ui/Input';
import { createTask } from '@/server/actions/create-task';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { z } from 'zod';

const FormSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title is required'
    })
    .trim()
    .min(1)
});

type FormType = z.infer<typeof FormSchema>;

function AddTask() {
  const {
    register,
    handleSubmit,
    reset
    // formState: { errors }
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema)
  });

  const onSubmit: SubmitHandler<FormType> = async ({ title }) => {
    const result = await createTask({ title, index: 0 });
    console.log('result', result);

    reset();
  };

  return (
    <form className="pb-2 pl-5" onSubmit={handleSubmit(onSubmit)}>
      <Input placeholder="Add Task" type="text" {...register('title')} />
    </form>
  );
}

export default AddTask;
