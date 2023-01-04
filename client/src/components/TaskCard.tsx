import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { useListContext } from '../context/ListContext';
import { ListItem, TaskItem } from '../types';
import { CreateSubtask } from './create-sub_task';
import { DeleteToDoTask } from './delete-todo-task';
import { DisplaySubtasks } from './display-sub_tasks';

interface TaskCardProps {
  task: TaskItem;
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
    fetch(`http://localhost:3001/task/${task.id}`, {
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
    <div className="flex flex-col rounded-xl shadow border p-3 my-6 ">
      <div ref={drag}>
        <i className="fa-solid fa-grip handle cursor-grab active:cursor-grabbing my-3 " />
      </div>

      <input
        className="w-40 text-lg bg-transparent handle"
        type="text"
        value={tempTask}
        placeholder={task.name}
        onChange={(e) => {
          setTempTask(e.target.value);
        }}
        onBlur={() => editTask(task.list_id)}
      />
      <DeleteToDoTask id={task.id} />
      <DisplaySubtasks subtasks={task.subtasks} />
      <CreateSubtask task_id={task.id} />
    </div>
  );
}
