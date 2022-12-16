import React, { useState } from 'react';
import { CreateSubtask } from './create-sub_task';
import { DisplaySubtasks } from './display-sub_tasks';

interface TaskCardProps {
  task: any;
  onDelete: () => void;
  subtasks: any[];
}

export function TaskCard({ task, onDelete, subtasks }: TaskCardProps) {
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
    <div className="flex flex-col rounded-xl shadow border p-8 my-6">
      <input
        className="w-40 font-semibold bg-transparent"
        type="text"
        value={tempTask}
        placeholder={task.name}
        onChange={(e) => {
          setTempTask(e.target.value);
        }}
        onBlur={editTask}
      />
      <DisplaySubtasks subtasks={task.subtasks} onDelete={onDelete} />
      <CreateSubtask task_id={task.id} />
    </div>
  );
}
