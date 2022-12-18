export type StatusItem = {
  id: number;
  name: string;
  tasks: TaskItem[];
};

export type TaskItem = {
  id: number;
  status_list_id: number;
  name: string;
  subtasks: SubtaskItem[];
};

export type SubtaskItem = any;
