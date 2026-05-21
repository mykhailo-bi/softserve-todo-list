import { createAction, props } from '@ngrx/store';
import {
  TodoItem,
  CreateTodoItemRequest,
  UpdateTodoItemRequest,
} from '../../models/todo-item.model';
import { TodoItemStatus } from '../../models/todo-item-status.enum';

// Load todos
export const loadTodos = createAction(
  '[Todo List] Load Todos',
  props<{ status?: TodoItemStatus }>(),
);
export const loadTodosSuccess = createAction(
  '[Todo List] Load Todos Success',
  props<{ todos: TodoItem[] }>(),
);
export const loadTodosFailure = createAction(
  '[Todo List] Load Todos Failure',
  props<{ error: string }>(),
);

// Create todo
export const createTodo = createAction(
  '[Todo Form] Create Todo',
  props<{ request: CreateTodoItemRequest }>(),
);
export const createTodoSuccess = createAction(
  '[Todo API] Create Todo Success',
  props<{ id: string }>(),
);
export const createTodoFailure = createAction(
  '[Todo API] Create Todo Failure',
  props<{ error: string }>(),
);

// Update todo
export const updateTodo = createAction(
  '[Todo Form] Update Todo',
  props<{ id: string; request: UpdateTodoItemRequest }>(),
);
export const updateTodoSuccess = createAction(
  '[Todo API] Update Todo Success',
);
export const updateTodoFailure = createAction(
  '[Todo API] Update Todo Failure',
  props<{ error: string }>(),
);

// Change status
export const changeTodoStatus = createAction(
  '[Todo Item] Change Todo Status',
  props<{ id: string; status: TodoItemStatus }>(),
);
export const changeTodoStatusSuccess = createAction(
  '[Todo API] Change Todo Status Success',
);
export const changeTodoStatusFailure = createAction(
  '[Todo API] Change Todo Status Failure',
  props<{ error: string }>(),
);

// Delete todo
export const deleteTodo = createAction(
  '[Todo Item] Delete Todo',
  props<{ id: string }>(),
);
export const deleteTodoSuccess = createAction(
  '[Todo API] Delete Todo Success',
);
export const deleteTodoFailure = createAction(
  '[Todo API] Delete Todo Failure',
  props<{ error: string }>(),
);

// Filter
export const setStatusFilter = createAction(
  '[Todo List] Set Status Filter',
  props<{ status: TodoItemStatus | null }>(),
);

export const setSearchTerm = createAction(
  '[Todo List] Set Search Term',
  props<{ searchTerm: string }>(),
);
