import { TodoState } from '@/types';
import { TodoResponse } from '@/utils/response';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: TodoState = {
  todo: null,
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setTodo: (state, action: PayloadAction<{ todo: TodoResponse }>) => {
      const { todo } = action.payload;
      state.todo = { ...todo };
    },
  },
});

export const { setTodo } = todoSlice.actions;
export default todoSlice.reducer;
