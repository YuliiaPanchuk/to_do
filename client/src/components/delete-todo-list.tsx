import React from 'react';

export function DeleteToDoList() {
  function handleDelete() {
    fetch('http://localhost:3001/delete', {});
  }

  return (
    <>
      <button>Delete</button>
    </>
  );
}
