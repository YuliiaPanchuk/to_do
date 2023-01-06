import classNames from 'classnames';
import React, { useCallback, useEffect, useState } from 'react';
import { BlockPicker } from 'react-color';
import { useDrop } from 'react-dnd';
import { useListContext } from '../context/ListContext';
import { useIsDragging } from '../hooks/useIsDragging';
import { ListItem } from '../types';
import { CreateTodoTask, TaskCard } from './TaskCard';

interface ColumnProps {
  list: ListItem;
}
export function Column({ list }: ColumnProps) {
  const [tempList, setTempList] = useState<string>(list.name || '');
  const [color, setColor] = useState<string>(list.color || '#ebecf0');
  const { fetchLists } = useListContext();

  const isDragging = useIsDragging();

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: () => list,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const saveChanges = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_HOST}/list/${list.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        list_name: tempList,
        color: color,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(fetchLists)
      .catch((error) => console.error(`An error occured ${error}`));
  }, [color, fetchLists, list.id, tempList]);

  useEffect(() => {
    saveChanges();
  }, [color, saveChanges]);

  return (
    <div className="max-w-[300px] h-auto rounded-md shadow border p-3 my-6 mx-2 bg-[#ebecf0]">
      <div className="flex flex-wrap my-1">
        <input
          className="mr-1 py-px text-xl bg-transparent outline-blue-500 rounded-md"
          style={{ backgroundColor: color }}
          type="text"
          value={tempList}
          onChange={(e) => {
            setTempList(e.target.value);
          }}
          onBlur={saveChanges}
        />
        <DeleteToDoList id={list.id} />
        <ColorPicker color={color} onChange={setColor} />
      </div>

      <div>
        <div
          ref={drop}
          className={classNames(
            'min-h-[40px]',
            isDragging && 'outline-dashed outline-2 outline-offset-2 rounded-md outline-blue-500',
          )}
        >
          {list.tasks.map((task: any) => (
            <TaskCard task={task} key={task.id} />
          ))}
        </div>
        <CreateTodoTask list_id={list.id} />
      </div>
    </div>
  );
}

export function CreateToDoList() {
  const [list, setList] = useState('');
  const { fetchLists } = useListContext();
  function createTodoList() {
    fetch(`${process.env.REACT_APP_API_HOST}/list`, {
      method: 'POST',
      body: JSON.stringify({
        list_name: list,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then(() => {
        setList('');
        fetchLists();
      })
      .catch((error) => alert(`Something went wrong to create to do list ${error}`));
  }
  return (
    <div className="flex my-4">
      <div className="mr-2">
        <input
          className="outline-blue-500"
          type="text"
          placeholder="Add another list"
          value={list}
          onChange={(e) => setList(e.target.value)}
        />
      </div>
      <button onClick={createTodoList}>
        <i className="fa-regular fa-plus pr-0.5" />
        New
      </button>
    </div>
  );
}

interface DeleteToDoListProps {
  id: string;
}

function DeleteToDoList({ id }: DeleteToDoListProps) {
  const { fetchLists } = useListContext();

  function handleDeleteToDo() {
    fetch(`${process.env.REACT_APP_API_HOST}/list/${id}`, {
      method: 'DELETE',
    }).then(fetchLists);
  }

  return (
    <div>
      <button onClick={handleDeleteToDo}>
        <i className="fa-regular fa-trash-can fa-xs" />
      </button>
    </div>
  );
}

interface ColorPickerProps {
  color: string;
  onChange: (value: string) => void;
}

function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isShown, setIsShown] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsShown((value) => !value)} className="ml-2">
        <i className="fa-solid fa-palette" />
      </button>
      {isShown && (
        <div className="absolute" style={{ left: 'calc(-85px + 14px)', top: '32px' }}>
          <BlockPicker
            color={color}
            onChange={(color) => {
              onChange(color.hex);
            }}
          />
        </div>
      )}
    </div>
  );
}
