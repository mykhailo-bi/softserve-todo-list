import { TodoItem } from '../../models/todo-item.model';
import { TodoItemStatus } from '../../models/todo-item-status.enum';

export interface TodosState {
  todos: TodoItem[];
  loading: boolean;
  error: string | null;
  statusFilter: TodoItemStatus | null;
  searchTerm: string;
}

export const initialState: TodosState = {
  todos: [],
  loading: false,
  error: null,
  statusFilter: null,
  searchTerm: '',
};
