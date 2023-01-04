import React from 'react';
import { useListContext } from '../context/ListContext';

interface DeleteToDoListProps {
  id: string;
}

export function DeleteToDoList({ id }: DeleteToDoListProps) {
  const { fetchLists } = useListContext();

  function handleDeleteToDo() {
    fetch(`http://localhost:3001/list/${id}`, {
      method: 'DELETE',
    }).then(fetchLists);
  }

  return (
    <div>
      <button onClick={handleDeleteToDo}>
        <i className="fa-regular fa-trash-can fa-xs" />
      </button>
    </div>
  );
}
