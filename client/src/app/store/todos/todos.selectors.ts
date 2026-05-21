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
    let filtered = state.todos;
    if (state.statusFilter !== null) {
      filtered = filtered.filter((todo) => todo.status === state.statusFilter);
    }
    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase();
      filtered = filtered.filter((todo) =>
        todo.title.toLowerCase().includes(term),
      );
    }
    return filtered;
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

export const selectSearchTerm = createSelector(
  selectTodosState,
  (state) => state.searchTerm,
);

export const selectTodoById = (id: string) =>
  createSelector(selectAllTodos, (todos) =>
    todos.find((todo) => todo.id === id),
  );
