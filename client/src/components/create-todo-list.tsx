import React, { useState } from 'react';
import { useListContext } from '../context/ListContext';

export function CreateToDoList() {
  const [toDo, setToDo] = useState('');
  const { fetchLists } = useListContext();

  function createTodoList() {
    fetch('http://localhost:3001/list', {
      method: 'POST',
      body: JSON.stringify({
        list_name: toDo,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then(() => {
        setToDo('');
        fetchLists();
      })
      .catch((error) => alert(`Something went wrong to create to do list ${error}`));
  }

  return (
    <div className="flex my-4">
      <div className="mr-2">
        <input
          type="text"
          placeholder="Insert status property"
          value={toDo}
          onChange={(e) => setToDo(e.target.value)}
        />
      </div>
      <button onClick={createTodoList}>
        <i className="fa-regular fa-plus pr-0.5" />
        New
      </button>
    </div>
  );
}
