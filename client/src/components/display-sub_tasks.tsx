import React from 'react';
import { DeleteSubtask } from './delete-subtask';

interface DisplaySubtasksProps {
  subtasks: any[];
  onDelete: () => void;
}

export function DisplaySubtasks({ subtasks, onDelete }: DisplaySubtasksProps) {
  return (
    <div className="my-2">
      {subtasks.map((subtask) => (
        <div key={subtask.id} className="flex">
          <DeleteSubtask onDelete={onDelete} id={subtask.id} />
          <input type="text" value={subtask.sub_task_name} readOnly={true} />
        </div>
      ))}
    </div>
  );
}
