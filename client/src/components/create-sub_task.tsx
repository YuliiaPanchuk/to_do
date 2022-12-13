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
    });
  }

  return (
    <div>
      <input
        type="text"
        value={subtask}
        onChange={(e) => {
          setSubtask(e.target.value);
        }}
      />
      <button onClick={fetchSubtasks}>Add subtask</button>
    </div>
  );
}
