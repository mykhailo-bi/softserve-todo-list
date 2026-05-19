import { TodoItemStatus } from './todo-item-status.enum';

export interface TodoItem {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: TodoItemStatus;
  createdAtUtc: string;
}

export interface CreateTodoItemRequest {
  title: string;
  description: string | null;
  dueDate: string | null;
}

export interface UpdateTodoItemRequest {
  title: string;
  description: string | null;
  dueDate: string | null;
}

export interface ChangeTodoItemStatusRequest {
  status: TodoItemStatus;
}
