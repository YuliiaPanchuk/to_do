import React from 'react';
import { DeleteSubtask } from './delete-subtask';

interface DisplaySubtasksProps {
  subtasks: any[];
  onDelete: () => void;
}

export function DisplaySubtasks({ subtasks, onDelete }: DisplaySubtasksProps) {
  return (
    <div>
      {subtasks.map((subtask) => (
        <div key={subtask.task_id}>
          <input className="subtaskName" type="text" value={subtask.sub_task_name} />
          <DeleteSubtask onDelete={onDelete} id={subtask.id} />
        </div>
      ))}
    </div>
  );
}
