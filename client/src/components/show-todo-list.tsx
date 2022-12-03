import React, { useEffect, useState } from 'react';

export function DisplayTodoList() {
  const [list, setList] = useState<any[]>([]); // display all todo list
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/lists', {
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
  }, []);

  return (
    <div>
      {loading && <p>A moment please...</p>}
      {list.map((todo) => (
        <div key={todo.id}>
          <p>Displaying to do list: {todo.list_name}</p>
        </div>
      ))}
    </div>
  );
}
