import React, { useState } from 'react';

export function CreateTodoList() {
  const [task, setTask] = useState('');

  function fetchTasks() {
    fetch('http://localhost:3001/list/:id/task/', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  return <h1>Hello</h1>;
}
