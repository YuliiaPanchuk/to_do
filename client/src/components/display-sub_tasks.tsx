import React, { useState } from 'react';
import { useListContext } from '../context/ListContext';
import { SubtaskItem } from '../types';
import { DeleteSubtask } from './delete-subtask';

interface DisplaySubtasksProps {
  subtasks: SubtaskItem[];
}

export function DisplaySubtasks({ subtasks }: DisplaySubtasksProps) {
  return (
    <div className="my-2">
      {subtasks.map((subtask) => (
        <Subtask key={subtask.id} subtask={subtask} />
      ))}
    </div>
  );
}

interface SubtaskProps {
  subtask: SubtaskItem;
}

function Subtask({ subtask }: SubtaskProps) {
  const [tempSubTask, setTempSubtask] = useState(subtask.name);
  const { fetchLists } = useListContext();

  function editSubtask() {
    fetch(`http://localhost:3001/subtask/${subtask.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        sub_task_name: tempSubTask,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(fetchLists)
      .catch((error) => console.error(`An error occured ${error}`));
  }

  return (
    <div className="flex">
      <DeleteSubtask id={subtask.id} />
      <input
        type="text"
        value={tempSubTask}
        onChange={(e) => {
          setTempSubtask(e.target.value);
        }}
        onBlur={editSubtask}
      />
    </div>
  );
}
