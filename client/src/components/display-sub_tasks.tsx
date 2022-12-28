import React, { useState } from 'react';
import { useListContext } from '../context/ListContext';
import { SubtaskItem } from '../types';
import { DeleteSubtask } from './delete-subtask';

interface DisplaySubtasksProps {
  subtasks: SubtaskItem[];
}

export function DisplaySubtasks({ subtasks }: DisplaySubtasksProps) {
  const [tempSubTask, setTempSubtask] = useState('');
  const { fetchLists } = useListContext();

  function editSubtask(task_id: number) {
    fetch(`http://localhost:3001/task/${task_id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: tempSubTask,
        task_id,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then(() => {
        setTempSubtask('');
        fetchLists();
      })
      .catch((error) => console.error(`An error occured ${error}`));
  }

  return (
    <div className="my-2">
      {subtasks.map((subtask: any, index: any) => (
        <div key={index} className="flex">
          <DeleteSubtask id={subtask.id} />
          <input
            type="text"
            value={subtask.name}
            onChange={(e) => {
              setTempSubtask(e.target.value);
            }}
            onBlur={() => editSubtask(subtask.task_id)}
          />
        </div>
      ))}
    </div>
  );
}
