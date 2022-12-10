import React from 'react';
import { DeleteToDoList } from './delete-todo-list';

interface DisplayTodoListProps {
  list: any[];
  loading: boolean;
  onSuccess: () => void;
}

export function DisplayTodoList({ list, loading, onSuccess }: DisplayTodoListProps) {
  return (
    <div className="showTodoWrapper">
      {loading && <p>A moment please...</p>}
      {list.map((todo) => (
        <div key={todo.id}>
          <p>Displaying to do list: {todo.list_name}</p>
          <DeleteToDoList onSuccess={onSuccess} id={todo.id} />
        </div>
      ))}
    </div>
  );
}
