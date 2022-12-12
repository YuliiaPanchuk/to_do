import React from 'react';
import { CreateTodoTask } from './create-todo-task';
import { DeleteToDoList } from './delete-todo-list';

interface DisplayTodoListProps {
  lists: any[];
  loading: boolean;
  onSuccess: () => void;
}

export function DisplayTodoList({ lists, loading, onSuccess }: DisplayTodoListProps) {
  return (
    <div className="showTodoWrapper">
      {loading && <p>A moment please...</p>}
      {lists.map((list) => (
        <div key={list.id}>
          <div className="showTodoList">
            <p className="toDoListHeader">{list.name}</p>
            <DeleteToDoList onSuccess={onSuccess} id={list.id} />
          </div>
          <div>
            <CreateTodoTask list_id={list.id} />
            <div>
              {list.tasks.map((task: any) => (
                <div key={task.id}>{task.name}</div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
