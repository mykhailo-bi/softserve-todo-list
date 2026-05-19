import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodosState } from './todos.state';

export const selectTodosState = createFeatureSelector<TodosState>('todos');

export const selectAllTodos = createSelector(
  selectTodosState,
  (state) => state.todos,
);

export const selectFilteredTodos = createSelector(
  selectTodosState,
  (state) => {
    if (state.statusFilter === null) {
      return state.todos;
    }
    return state.todos.filter((todo) => todo.status === state.statusFilter);
  },
);

export const selectTodosLoading = createSelector(
  selectTodosState,
  (state) => state.loading,
);

export const selectTodosError = createSelector(
  selectTodosState,
  (state) => state.error,
);

export const selectStatusFilter = createSelector(
  selectTodosState,
  (state) => state.statusFilter,
);

export const selectTodoById = (id: string) =>
  createSelector(selectAllTodos, (todos) =>
    todos.find((todo) => todo.id === id),
  );
