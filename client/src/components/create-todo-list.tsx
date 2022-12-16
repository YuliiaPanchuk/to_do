import React, { useState } from 'react';

export function CreateToDoList() {
  const [toDo, setToDo] = useState(''); // when user inserts todo list

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
      })
      .catch((err) => alert(`Something went wrong to create to do list ${err}`));
  }

  return (
    <div className="flex my-4">
      <div className="mr-2">
        <input
          type="text"
          placeholder="Insert status property"
          value={toDo} // saving user value to todo state
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
