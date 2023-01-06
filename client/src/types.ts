export type ListItem = {
  id: string;
  name: string;
  color?: string;
  tasks: TaskItem[];
};

export type TaskItem = {
  id: string;
  list_id: string;
  name: string;
  subtasks: SubtaskItem[];
};

export type SubtaskItem = {
  id: string;
  name: string;
  task_id: string;
  isChecked?: boolean;
};
