import React from 'react';
import { useListContext } from '../context/ListContext';

interface DeleteToDoTaskProps {
  id: string;
}

export function DeleteToDoTask({ id }: DeleteToDoTaskProps) {
  const { fetchLists } = useListContext();

  function handleDelete() {
    fetch(`http://localhost:3001/task/${id}`, {
      method: 'DELETE',
    }).then(fetchLists);
  }

  return (
    <div onClick={handleDelete}>
      <i className="fa-regular fa-trash-can fa-xs" />
    </div>
  );
}
