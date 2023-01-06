import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Column, CreateToDoList } from './components/Column';
import { ListProvider, useListContext } from './context/ListContext';

function App() {
  const { lists } = useListContext();

  return (
    <div className="container mx-auto p-8 m-10">
      <CreateToDoList />
      <div className="flex flex-wrap justify-center">
        {lists.map((list, index) => (
          <Column key={index} list={list} />
        ))}
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ListProvider>
        <App />
      </ListProvider>
    </DndProvider>
  );
}
