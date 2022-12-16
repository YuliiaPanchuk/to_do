import React, { useEffect, useState } from 'react';
import { CreateToDoList } from './components/create-todo-list';
import { DisplayTodoList } from './components/show-todo-list';

export default function App() {
  const [list, setList] = useState<any[]>([]); // display all todo list
  const [loading, setLoading] = useState(false);
  const [subtask, setSubtask] = useState<any[]>([]);

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

  function fetchSubtasks() {
    fetch('http://localhost:3001/list/task', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((data) => setSubtask(data.result))
      .catch((error) => console.log(`An error occured ${error}`));
  }

  useEffect(() => {
    fetchSubtasks();
  }, []);

  return (
    <div className="container mx-auto p-8 m-10">
      <div className="border-b border-indigo-500">All your todos are here</div>
      <CreateToDoList />
      <DisplayTodoList lists={list} loading={loading} onSuccess={fetchLists} subtasks={subtask} />
    </div>
  );
}
