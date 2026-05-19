import { todosReducer } from './todos.reducer';
import { initialState } from './todos.state';
import * as TodosActions from './todos.actions';
import { TodoItemStatus } from '../../models/todo-item-status.enum';
import { TodoItem } from '../../models/todo-item.model';

describe('TodosReducer', () => {
  const mockTodo: TodoItem = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    dueDate: null,
    status: TodoItemStatus.Todo,
    createdAtUtc: '2024-01-01T00:00:00Z',
  };

  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = { type: 'Unknown' };
      const state = todosReducer(initialState, action as any);

      expect(state).toBe(initialState);
    });
  });

  describe('loadTodos', () => {
    it('should set loading to true', () => {
      const action = TodosActions.loadTodos({});
      const state = todosReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('loadTodosSuccess', () => {
    it('should populate todos and set loading to false', () => {
      const todos = [mockTodo];
      const action = TodosActions.loadTodosSuccess({ todos });
      const state = todosReducer(initialState, action);

      expect(state.todos).toEqual(todos);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('loadTodosFailure', () => {
    it('should set error and loading to false', () => {
      const error = 'Failed to load todos';
      const action = TodosActions.loadTodosFailure({ error });
      const state = todosReducer(initialState, action);

      expect(state.error).toBe(error);
      expect(state.loading).toBe(false);
    });
  });

  describe('createTodo', () => {
    it('should set loading to true', () => {
      const action = TodosActions.createTodo({
        request: { title: 'New', description: null, dueDate: null },
      });
      const state = todosReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('createTodoSuccess', () => {
    it('should set loading to false', () => {
      const action = TodosActions.createTodoSuccess({ id: '1' });
      const state = todosReducer(
        { ...initialState, loading: true },
        action,
      );

      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('createTodoFailure', () => {
    it('should set error and loading to false', () => {
      const error = 'Failed to create todo';
      const action = TodosActions.createTodoFailure({ error });
      const state = todosReducer({ ...initialState, loading: true }, action);

      expect(state.error).toBe(error);
      expect(state.loading).toBe(false);
    });
  });

  describe('updateTodo', () => {
    it('should set loading to true', () => {
      const action = TodosActions.updateTodo({
        id: '1',
        request: { title: 'Updated', description: null, dueDate: null },
      });
      const state = todosReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('changeTodoStatus', () => {
    it('should set loading to true', () => {
      const action = TodosActions.changeTodoStatus({
        id: '1',
        status: TodoItemStatus.Done,
      });
      const state = todosReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('deleteTodo', () => {
    it('should set loading to true', () => {
      const action = TodosActions.deleteTodo({ id: '1' });
      const state = todosReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('setStatusFilter', () => {
    it('should set status filter', () => {
      const action = TodosActions.setStatusFilter({
        status: TodoItemStatus.InProgress,
      });
      const state = todosReducer(initialState, action);

      expect(state.statusFilter).toBe(TodoItemStatus.InProgress);
    });

    it('should clear status filter', () => {
      const stateWithFilter = {
        ...initialState,
        statusFilter: TodoItemStatus.Done,
      };
      const action = TodosActions.setStatusFilter({ status: null });
      const state = todosReducer(stateWithFilter, action);

      expect(state.statusFilter).toBeNull();
    });
  });
});
