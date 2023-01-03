import React from 'react';
import { useDrop } from 'react-dnd';
import { CreateTodoTask } from './create-todo-task';
import { DeleteToDoList } from './delete-todo-list';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  list: any;
}

export function Column({ list }: ColumnProps) {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: () => list,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  return (
    <div className="min-w-[300px] m-2 h-auto border">
      <div className="flex my-1 ">
        <p className="mr-1 text-xl">{list.name}</p> {/* contentEditable={true} */}
        <DeleteToDoList id={list.id} />
      </div>

      <div>
        <CreateTodoTask list_id={list.id} />
        <div ref={drop} className="h-48">
          {list.tasks.map((task: any) => (
            <div key={task.id}>
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
