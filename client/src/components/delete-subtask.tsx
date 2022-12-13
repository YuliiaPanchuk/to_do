import React from 'react';

interface DeleteSubtaskProps {
  onDelete: () => void;
  id: number;
}

export function DeleteSubtask({ onDelete, id }: DeleteSubtaskProps) {
  function handleDeleteSubtask() {
    fetch(`http://localhost:3001/subtask/${id}`, {
      method: 'DELETE',
    }).then(onDelete);
  }

  return (
    <div>
      <button onClick={handleDeleteSubtask}>
        <i className="fa-regular fa-trash-can" />
      </button>
    </div>
  );
}
