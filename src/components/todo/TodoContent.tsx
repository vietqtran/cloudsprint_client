'use client';

import { fetchTodo } from '@/services';
import { useQuery } from '@tanstack/react-query';

export default function TodoContent({ todoId }: { todoId: number }) {
  const {
    data: todo,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['todo', todoId],
    queryFn: () => fetchTodo(todoId),
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className='p-4 border rounded-md bg-white shadow-sm'>
      <h2 className='text-xl font-semibold mb-2'>
        #{todo?.id}: {todo?.title}
      </h2>
      <div className='grid grid-cols-2 gap-2 text-sm'>
        <div>User ID:</div>
        <div>{todo?.userId}</div>
        <div>Status:</div>
        <div>{todo?.completed ? 'Completed' : 'Pending'}</div>
      </div>
    </div>
  );
}
