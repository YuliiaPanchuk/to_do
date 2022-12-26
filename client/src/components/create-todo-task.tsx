import React, { useState } from 'react';

interface CreateTodoTaskProps {
  list_id: number;
}

export function CreateTodoTask({ list_id }: CreateTodoTaskProps) {
  const [task, setTask] = useState('');

  function fetchTasks() {
    fetch(`http://localhost:3001/list/${list_id}/task/`, {
      method: 'POST',
      body: JSON.stringify({
        task_name: task,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then(() => {
        setTask('');
      });
  }

  return (
    <div className="flex mr-2 min-w-[300px]">
      <input
        className="pl-0.5 text-center"
        type="text"
        placeholder="+ New"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onBlur={fetchTasks}
      />
    </div>
  );
}
