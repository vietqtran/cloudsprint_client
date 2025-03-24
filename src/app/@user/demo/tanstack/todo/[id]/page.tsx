import TodoContent from '@/components/todo/TodoContent';
import { fetchTodo } from '@/services';
import { getQueryClient } from '@/utils/react-query/get-query-client';
import { Hydrate } from '@/utils/react-query/hydrate-client';
import { dehydrate } from '@tanstack/react-query';
import { Metadata } from 'next';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const todoId = parseInt(id, 10);

  const todo = await fetchTodo(todoId);

  return {
    title: `Todo: ${todo?.title || 'Todo Details'}`,
    description: todo?.completed ? 'Completed task' : 'Pending task',
    openGraph: {
      title: `Todo: ${todo?.title || 'Todo Details'}`,
      description: todo?.completed ? 'Completed task' : 'Pending task',
    },
  };
}

export default async function TodoPage({ params }: PageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();
  const todoId = parseInt(id, 10);

  await queryClient.prefetchQuery({
    queryKey: ['todo', todoId],
    queryFn: () => fetchTodo(todoId),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <main className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Todo Details</h1>
      <Hydrate state={dehydratedState}>
        <TodoContent todoId={todoId} />
      </Hydrate>
    </main>
  );
}
