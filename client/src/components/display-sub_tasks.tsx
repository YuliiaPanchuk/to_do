import React, { useState } from 'react';
import { DeleteSubtask } from './delete-subtask';

interface DisplaySubtasksProps {
  subtasks: any;
}

export function DisplaySubtasks({ subtasks }: DisplaySubtasksProps) {
  const [tempSubTask, setTempSubtask] = useState('');

  function editSubtask(task_id: number) {
    fetch(`http://localhost:3001/task/${subtasks.task_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        sub_task_name: tempSubTask,
        task_id,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .catch((error) => console.error(`An error occured ${error}`));
  }

  return (
    <div className="my-2">
      {subtasks.map((subtask: any) => (
        <div key={subtask.id} className="flex">
          <DeleteSubtask id={subtask.id} />
          <input type="text" value={subtask.sub_task_name} />
        </div>
      ))}
    </div>
  );
}
