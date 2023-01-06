import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useListContext } from '../context/ListContext';
import { ListItem, TaskItem } from '../types';
import { CreateSubtask, DisplaySubtasks } from './Subtasks';

interface TaskCardProps {
  task: TaskItem;
}

interface CreateTodoTaskProps {
  list_id: string;
}

interface DeleteToDoTaskProps {
  id: string;
}

export function TaskCard({ task }: TaskCardProps) {
  const { fetchLists } = useListContext();
  const [tempTask, setTempTask] = useState<string>(task.name || '');

  const [, drag] = useDrag(() => ({
    type: 'task',
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<ListItem>();

      if (item && dropResult) {
        editTask(dropResult.id);
      }
    },
  }));

  function editTask(list_id: TaskItem['list_id']) {
    fetch(`${process.env.REACT_APP_API_HOST}/task/${task.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        task_name: tempTask,
        list_id: list_id,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(fetchLists)
      .catch((error) => console.log(`An error occured ${error}`));
  }

  return (
    <div className="flex flex-col rounded-xl shadow border p-3 my-4 bg-white">
      <div ref={drag}>
        <i className="fa-solid fa-grip handle cursor-grab active:cursor-grabbing my-3 fa-xs" />
      </div>

      <div className="flex flex-row justify-around">
        <input
          className="text-lg w-48 bg-transparent handle outline-blue-500"
          type="text"
          value={tempTask}
          placeholder={task.name}
          onChange={(e) => {
            setTempTask(e.target.value);
          }}
          onBlur={() => editTask(task.list_id)}
        />
        <DeleteToDoTask id={task.id} />
      </div>
      <DisplaySubtasks subtasks={task.subtasks} />
      <CreateSubtask task_id={task.id} />
    </div>
  );
}

export function CreateTodoTask({ list_id }: CreateTodoTaskProps) {
  const [task, setTask] = useState('');
  const { fetchLists } = useListContext();

  function fetchTasks() {
    fetch(`${process.env.REACT_APP_API_HOST}/list/${list_id}/task/`, {
      method: 'POST',
      body: JSON.stringify({
        task_name: task,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then(() => {
        setTask('');
        fetchLists();
      });
  }

  return (
    <div className="flex p-3 min-w-[300px]">
      <input
        className="p-1 outline-blue-500 bg-transparent hover:bg-[#dadbe2] hover:rounded-sm hover:cursor-text"
        type="text"
        placeholder="+ Add a card"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onBlur={fetchTasks}
      />
    </div>
  );
}

export function DeleteToDoTask({ id }: DeleteToDoTaskProps) {
  const { fetchLists } = useListContext();

  function handleDelete() {
    fetch(`${process.env.REACT_APP_API_HOST}/task/${id}`, {
      method: 'DELETE',
    }).then(fetchLists);
  }

  return (
    <div onClick={handleDelete} className="w-px">
      <i className="fa-regular fa-trash-can fa-xs" />
    </div>
  );
}
