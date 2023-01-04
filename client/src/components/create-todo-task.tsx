import React, { useState } from 'react';
import { useListContext } from '../context/ListContext';
import { TaskItem } from '../types';

interface CreateTodoTaskProps {
  list_id: string;
}

export function CreateTodoTask({ list_id }: CreateTodoTaskProps) {
  const [task, setTask] = useState('');
  const { fetchLists } = useListContext();

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
        fetchLists();
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
