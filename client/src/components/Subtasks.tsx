import React, { useCallback, useEffect, useState } from 'react';
import { useListContext } from '../context/ListContext';
import { SubtaskItem } from '../types';
import classNames from 'classnames';

interface DisplaySubtasksProps {
  subtasks: SubtaskItem[];
}

interface DeleteSubtaskProps {
  id: string;
}

interface SubtaskProps {
  subtask: SubtaskItem;
}

interface CreateSubtaskProps {
  task_id: string;
}

export function DisplaySubtasks({ subtasks }: DisplaySubtasksProps) {
  return (
    <div className="my-2">
      {subtasks.map((subtask) => (
        <Subtask key={subtask.id} subtask={subtask} />
      ))}
    </div>
  );
}

function DeleteSubtask({ id }: DeleteSubtaskProps) {
  const { fetchLists } = useListContext();

  function handleDeleteSubtask() {
    fetch(`${process.env.REACT_APP_API_HOST}/subtask/${id}`, {
      method: 'DELETE',
    }).then(fetchLists);
  }

  return (
    <button onClick={handleDeleteSubtask} className="mr-2 w-px">
      <i className="fa-regular fa-trash-can fa-xs" />
    </button>
  );
}

function Subtask({ subtask }: SubtaskProps) {
  const [tempSubTask, setTempSubtask] = useState(subtask.name);
  const [isChecked, setIsChecked] = useState(!!subtask.isChecked);
  const { fetchLists } = useListContext();

  const saveChanges = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_HOST}/subtask/${subtask.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        sub_task_name: tempSubTask,
        isChecked: isChecked,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(fetchLists)
      .catch((error) => console.error(`An error occured ${error}`));
  }, [fetchLists, isChecked, subtask.id, tempSubTask]);

  useEffect(() => {
    saveChanges();
  }, [isChecked, saveChanges]);

  return (
    <div className="flex border-b justify-around">
      <input
        className="cursor-pointer"
        type="checkbox"
        checked={isChecked}
        onChange={(event) => setIsChecked(event.target.checked)}
      />
      <input
        className={classNames('outline-blue-500 w-48', isChecked ? 'line-through' : 'no-underline')}
        type="text"
        value={tempSubTask}
        onChange={(e) => {
          setTempSubtask(e.target.value);
        }}
        onBlur={saveChanges}
      />
      <DeleteSubtask id={subtask.id} />
    </div>
  );
}

export function CreateSubtask({ task_id }: CreateSubtaskProps) {
  const [subtask, setSubtask] = useState('');
  const { fetchLists } = useListContext();

  function fetchSubtasks() {
    fetch(`${process.env.REACT_APP_API_HOST}/task/${task_id}/subtask`, {
      method: 'POST',
      body: JSON.stringify({
        sub_task_name: subtask,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then(() => {
        setSubtask('');
        fetchLists();
      })
      .catch((error) => alert(`Something went wrong to create subtask ${error}`));
  }

  return (
    <input
      className="my-2 pl-0.5 outline-blue-500"
      placeholder="Add subtask"
      type="text"
      value={subtask}
      onChange={(e) => {
        setSubtask(e.target.value);
      }}
      onBlur={fetchSubtasks}
    />
  );
}
