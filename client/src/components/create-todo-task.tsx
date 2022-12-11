import React, { useState } from 'react';

interface CreateTodoTaskProps {
  list_id: number;
}

export function CreateTodoTask({ list_id }: CreateTodoTaskProps) {
  const [task, setTask] = useState('');
  const [taskId, setTaskId] = useState('');

  function fetchTasks() {
    fetch(`http://localhost:3001/list/${list_id}/task/`, {
      method: 'POST',
      body: JSON.stringify({
        task_name: task,
        todo_id: taskId,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then((response) => response.json());

    console.log({ fetchTasks });
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Task name"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={fetchTasks}>
        <i className="fa-regular fa-plus" />
        New
      </button>
    </div>
  );
}
