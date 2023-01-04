import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useListContext } from '../context/ListContext';
import { ListItem } from '../types';
import { CreateTodoTask } from './create-todo-task';
import { DeleteToDoList } from './delete-todo-list';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  list: ListItem;
}

export function Column({ list }: ColumnProps) {
  const [tempList, setTempList] = useState(list.name);
  const { fetchLists } = useListContext();

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: () => list,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  function editList() {
    fetch(`http://localhost:3001/list/${list.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        list_name: tempList,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(fetchLists)
      .catch((error) => console.error(`An error occured ${error}`));
  }

  return (
    <div className="min-w-[300px] m-2 h-auto border">
      <div className="flex my-1 ">
        <input
          className="mr-1 text-xl"
          type="text"
          value={list.name}
          onChange={(e) => {
            setTempList(e.target.value);
          }}
          onBlur={editList}
        />
        <DeleteToDoList id={list.id} />
      </div>

      <div>
        <CreateTodoTask list_id={list.id} />
        <div ref={drop} className="h-48">
          {list.tasks.map((task: any) => (
            <TaskCard task={task} key={task.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
