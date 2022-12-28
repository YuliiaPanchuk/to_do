import React, { useState } from 'react';
import { useListContext } from '../context/ListContext';

interface CreateSubtaskProps {
  task_id: string;
}

export function CreateSubtask({ task_id }: CreateSubtaskProps) {
  const [subtask, setSubtask] = useState('');
  const { fetchLists } = useListContext();

  function fetchSubtasks() {
    fetch(`http://localhost:3001/task/${task_id}/subtask`, {
      method: 'POST',
      body: JSON.stringify({
        sub_task_name: subtask,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then(() => {
        setSubtask('');
        fetchLists();
      })
      .catch((error) => alert(`Something went wrong to create subtask ${error}`));
  }

  return (
    <input
      className="my-2 pl-0.5"
      placeholder="Add subtask"
      type="text"
      value={subtask}
      onChange={(e) => {
        setSubtask(e.target.value);
      }}
      onBlur={fetchSubtasks}
    />
  );
}
