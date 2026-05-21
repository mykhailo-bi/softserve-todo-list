import { createReducer, on } from '@ngrx/store';
import { initialState } from './todos.state';
import * as TodosActions from './todos.actions';

export const todosReducer = createReducer(
  initialState,

  // Load todos
  on(TodosActions.loadTodos, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TodosActions.loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos,
    loading: false,
    error: null,
  })),
  on(TodosActions.loadTodosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create todo
  on(TodosActions.createTodo, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TodosActions.createTodoSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),
  on(TodosActions.createTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update todo
  on(TodosActions.updateTodo, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TodosActions.updateTodoSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),
  on(TodosActions.updateTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Change status
  on(TodosActions.changeTodoStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TodosActions.changeTodoStatusSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),
  on(TodosActions.changeTodoStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete todo
  on(TodosActions.deleteTodo, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(TodosActions.deleteTodoSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),
  on(TodosActions.deleteTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Filter
  on(TodosActions.setStatusFilter, (state, { status }) => ({
    ...state,
    statusFilter: status,
  })),
  on(TodosActions.setSearchTerm, (state, { searchTerm }) => ({
    ...state,
    searchTerm,
  })),
);
