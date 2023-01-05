import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { useListContext } from '../context/ListContext';
import { ListItem } from '../types';
import { CreateTodoTask, TaskCard } from './TaskCard';

// #ebecf0

// #110908

interface ColumnProps {
  list: ListItem;
}
export function Column({ list }: ColumnProps) {
  const [tempList, setTempList] = useState<string>(list.name || '');
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
    <div className="max-w-[300px] h-auto rounded-md shadow border p-3 my-6 mx-2 bg-[#ebecf0]">
      <div className="flex my-1">
        <input
          className="mr-1 text-xl bg-transparent outline-blue-500"
          type="text"
          value={tempList}
          onChange={(e) => {
            setTempList(e.target.value);
          }}
          onBlur={editList}
        />
        <DeleteToDoList id={list.id} />
      </div>

      <div>
        <CreateTodoTask list_id={list.id} />
        <div ref={drop} className="h-screen">
          {list.tasks.map((task: any) => (
            <TaskCard task={task} key={task.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CreateToDoList() {
  const [list, setList] = useState('');
  const { fetchLists } = useListContext();
  function createTodoList() {
    fetch('http://localhost:3001/list', {
      method: 'POST',
      body: JSON.stringify({
        list_name: list,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then(() => {
        setList('');
        fetchLists();
      })
      .catch((error) => alert(`Something went wrong to create to do list ${error}`));
  }
  return (
    <div className="flex my-4">
      <div className="mr-2">
        <input
          className="outline-blue-500"
          type="text"
          placeholder="Insert status property"
          value={list}
          onChange={(e) => setList(e.target.value)}
        />
      </div>
      <button onClick={createTodoList}>
        <i className="fa-regular fa-plus pr-0.5" />
        New
      </button>
    </div>
  );
}

interface DeleteToDoListProps {
  id: string;
}

function DeleteToDoList({ id }: DeleteToDoListProps) {
  const { fetchLists } = useListContext();

  function handleDeleteToDo() {
    fetch(`http://localhost:3001/list/${id}`, {
      method: 'DELETE',
    }).then(fetchLists);
  }

  return (
    <div>
      <button onClick={handleDeleteToDo}>
        <i className="fa-regular fa-trash-can fa-xs" />
      </button>
    </div>
  );
}
