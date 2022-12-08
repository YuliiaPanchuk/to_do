import React from 'react';

interface DeleteToDoListProps {
  onSuccess: () => void;
  id: number;
}

export function DeleteToDoList({ onSuccess, id }: DeleteToDoListProps) {
  function handleDeleteToDo() {
    fetch(`http://localhost:3001/list/${id}`, {
      method: 'DELETE',
    }).then(onSuccess);
  }

  return (
    <>
      <button onClick={handleDeleteToDo}>Delete</button>
    </>
  );
}
