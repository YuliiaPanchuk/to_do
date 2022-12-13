import React, { useState } from 'react';
import { CreateSubtask } from './create-sub_task';

interface TaskCardProps {
  task: any;
}

export function TaskCard({ task }: TaskCardProps) {
  const [tempTask, setTempTask] = useState<string>(task.name || '');

  function editTask() {
    fetch(`http://localhost:3001/task/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        task_name: tempTask,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .catch((error) => console.log(`An error occured ${error}`));
  }

  return (
    <div className="taskNameContainer">
      <input
        type="text"
        className="taskNameWrapper"
        value={tempTask}
        placeholder={task.name}
        onChange={(e) => {
          setTempTask(e.target.value);
        }}
        onBlur={editTask}
      />
      <CreateSubtask task_id={task.id} />
    </div>
  );
}
