import instance from '@/utils/_api/axios';
import { TodoResponse } from '@/utils/response';

const fetchTodo = async (id: number): Promise<TodoResponse> => {
  const { data } = await instance.get(`https://jsonplaceholder.typicode.com/todos/${id}`);

  if (!data) {
    throw new Error('Network response was not ok');
  }

  return data;
};

export { fetchTodo };
