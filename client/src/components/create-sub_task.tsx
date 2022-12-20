import React, { useState } from 'react';

interface CreateSubtaskProps {
  task_id: number;
}

export function CreateSubtask({ task_id }: CreateSubtaskProps) {
  const [subtask, setSubtask] = useState('');

  function fetchSubtasks() {
    fetch(`http://localhost:3001/task/${task_id}/subtask`, {
      method: 'POST',
      body: JSON.stringify({
        sub_task_name: subtask,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    }).then(() => setSubtask(''));
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
