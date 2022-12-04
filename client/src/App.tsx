import React from 'react';
import './App.css';
import { CreateToDoList } from './components/create-todo-list';
import { DeleteToDoList } from './components/delete-todo-list';
import { DisplayTodoList } from './components/show-todo-list';

export default function App() {
  return (
    <>
      <CreateToDoList />
      <DeleteToDoList />
      <DisplayTodoList />
    </>
  );
}

// * loop todo list, so it will be a list of created todos
// * when Submit btn is presset input field has to be empty
