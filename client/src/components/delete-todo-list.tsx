import React from 'react';
import { useListContext } from '../context/ListContext';
import { ListItem } from '../types';

interface DeleteToDoListProps {
  id: ListItem;
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
