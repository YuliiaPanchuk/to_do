import React from 'react';
import { useListContext } from '../context/ListContext';

interface DeleteSubtaskProps {
  id: number;
}

export function DeleteSubtask({ id }: DeleteSubtaskProps) {
  const { fetchLists } = useListContext();

  function handleDeleteSubtask() {
    fetch(`http://localhost:3001/subtask/${id}`, {
      method: 'DELETE',
    }).then(fetchLists);
  }

  return (
    <div>
      <button onClick={handleDeleteSubtask} className="mr-2">
        <i className="fa-regular fa-trash-can" />
      </button>
    </div>
  );
}
