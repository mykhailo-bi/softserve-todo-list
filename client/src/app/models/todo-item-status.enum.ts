export enum TodoItemStatus {
  Todo = 0,
  InProgress = 1,
  Done = 2,
}

export const TodoItemStatusLabels: Record<TodoItemStatus, string> = {
  [TodoItemStatus.Todo]: 'To Do',
  [TodoItemStatus.InProgress]: 'In Progress',
  [TodoItemStatus.Done]: 'Done',
};
