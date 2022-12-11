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
    <div className="deleteTodoWrapper">
      <button onClick={handleDeleteToDo} className="deleteToDoListButton">
        <i className="fa-regular fa-trash-can" />
      </button>
    </div>
  );
}
