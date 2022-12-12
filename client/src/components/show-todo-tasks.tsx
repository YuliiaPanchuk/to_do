import React, { useState } from 'react';

export function ShowToDoTasks() {
  const [tasks, setTasks] = useState('');

  function showTodoTasks() {
    fetch('http://localhost:3001/list/task', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => setTasks(data.task))
      .catch((error) => console.log('Error: ', error));
  }

  console.log(showTodoTasks);

  return (
    <div>
      <p></p>
    </div>
  );
}
