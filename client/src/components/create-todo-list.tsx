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
      .then((data) => {
        setToDo(data.list_name);
      })
      .catch((err) => alert(`Something went wrong to create to do list ${err}`));
  }

  console.log({ createTodoList });

  return (
    <>
      <div>
        <label>Create to do list</label>
        <input
          type="text"
          placeholder="Insert to do"
          value={toDo} // saving user value to todo state
          onChange={(e) => setToDo(e.target.value)}
        />
      </div>
      <button onClick={createTodoList}>Create to do</button>
    </>
  );
}
