import React from 'react';
import { CreateTodoTask } from './create-todo-task';
import { DeleteToDoList } from './delete-todo-list';
import { TaskCard } from './TaskCard';

interface DisplayTodoListProps {
  lists: any[];
  loading: boolean;
  onSuccess: () => void;
  subtasks: any[];
}

export function DisplayTodoList({ lists, loading, onSuccess, subtasks }: DisplayTodoListProps) {
  return (
    <div className="flex">
      {loading && <p>A moment please...</p>}

      {lists.map((list) => (
        <div key={list.id} className="min-w-[300px]  m-2">
          <div className="flex my-1 ">
            <p className="mr-1 font-bold">{list.name}</p>
            <DeleteToDoList onSuccess={onSuccess} id={list.id} />
          </div>

          <div>
            <div>
              {list.tasks.map((task: any) => (
                <div key={task.id}>
                  <TaskCard task={task} onDelete={onSuccess} subtasks={subtasks} />
                </div>
              ))}
            </div>
            <CreateTodoTask list_id={list.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
