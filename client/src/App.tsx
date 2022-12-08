import React, { useEffect, useState } from 'react';
import { CreateToDoList } from './components/create-todo-list';
import { DisplayTodoList } from './components/show-todo-list';

export default function App() {
  const [list, setList] = useState<any[]>([]); // display all todo list
  const [loading, setLoading] = useState(false);

  function fetchLists() {
    fetch('http://localhost:3001/list', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setList(data.result);
      })
      .catch((err) => {
        console.log(`An error occur ${err}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <>
      <CreateToDoList />
      <DisplayTodoList list={list} loading={loading} onSuccess={fetchLists} />
    </>
  );
}

// clear the input field after submit btn is pressed
//
// delete all to do list
// delete specified to do
//
// edit each to do list
// edit each to do
//
//
