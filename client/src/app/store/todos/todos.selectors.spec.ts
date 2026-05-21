import * as TodosSelectors from './todos.selectors';
import { TodosState } from './todos.state';
import { TodoItemStatus } from '../../models/todo-item-status.enum';
import { TodoItem } from '../../models/todo-item.model';

describe('TodosSelectors', () => {
  const mockTodos: TodoItem[] = [
    {
      id: '1',
      title: 'Todo 1',
      description: null,
      dueDate: null,
      status: TodoItemStatus.Todo,
      createdAtUtc: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Todo 2',
      description: null,
      dueDate: null,
      status: TodoItemStatus.InProgress,
      createdAtUtc: '2024-01-02T00:00:00Z',
    },
    {
      id: '3',
      title: 'Todo 3',
      description: null,
      dueDate: null,
      status: TodoItemStatus.Done,
      createdAtUtc: '2024-01-03T00:00:00Z',
    },
  ];

  const mockState: TodosState = {
    todos: mockTodos,
    loading: false,
    error: null,
    statusFilter: null,
    searchTerm: '',
  };

  describe('selectAllTodos', () => {
    it('should select all todos', () => {
      const result = TodosSelectors.selectAllTodos.projector(mockState);
      expect(result).toEqual(mockTodos);
    });
  });

  describe('selectFilteredTodos', () => {
    it('should return all todos when no filter is set', () => {
      const result = TodosSelectors.selectFilteredTodos.projector(mockState);
      expect(result).toEqual(mockTodos);
      expect(result.length).toBe(3);
    });

    it('should filter todos by status', () => {
      const stateWithFilter: TodosState = {
        ...mockState,
        statusFilter: TodoItemStatus.InProgress,
      };
      const result =
        TodosSelectors.selectFilteredTodos.projector(stateWithFilter);
      expect(result.length).toBe(1);
      expect(result[0].status).toBe(TodoItemStatus.InProgress);
    });

    it('should return empty array when no todos match filter', () => {
      const stateWithFilter: TodosState = {
        ...mockState,
        todos: [mockTodos[0]], // Only Todo status
        statusFilter: TodoItemStatus.Done,
      };
      const result =
        TodosSelectors.selectFilteredTodos.projector(stateWithFilter);
      expect(result.length).toBe(0);
    });

    it('should filter todos by search term (case-insensitive)', () => {
      const stateWithSearch: TodosState = {
        ...mockState,
        searchTerm: 'todo 2',
      };
      const result =
        TodosSelectors.selectFilteredTodos.projector(stateWithSearch);
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('Todo 2');
    });

    it('should return empty when search term matches no todos', () => {
      const stateWithSearch: TodosState = {
        ...mockState,
        searchTerm: 'nonexistent',
      };
      const result =
        TodosSelectors.selectFilteredTodos.projector(stateWithSearch);
      expect(result.length).toBe(0);
    });

    it('should combine status filter and search term', () => {
      const stateWithBoth: TodosState = {
        ...mockState,
        statusFilter: TodoItemStatus.Todo,
        searchTerm: 'Todo',
      };
      const result =
        TodosSelectors.selectFilteredTodos.projector(stateWithBoth);
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('Todo 1');
      expect(result[0].status).toBe(TodoItemStatus.Todo);
    });
  });

  describe('selectTodosLoading', () => {
    it('should select loading state', () => {
      const result = TodosSelectors.selectTodosLoading.projector(mockState);
      expect(result).toBe(false);
    });

    it('should select loading state when true', () => {
      const loadingState: TodosState = { ...mockState, loading: true };
      const result = TodosSelectors.selectTodosLoading.projector(loadingState);
      expect(result).toBe(true);
    });
  });

  describe('selectTodosError', () => {
    it('should select error state', () => {
      const result = TodosSelectors.selectTodosError.projector(mockState);
      expect(result).toBeNull();
    });

    it('should select error message', () => {
      const errorState: TodosState = {
        ...mockState,
        error: 'Something went wrong',
      };
      const result = TodosSelectors.selectTodosError.projector(errorState);
      expect(result).toBe('Something went wrong');
    });
  });

  describe('selectStatusFilter', () => {
    it('should select status filter', () => {
      const result = TodosSelectors.selectStatusFilter.projector(mockState);
      expect(result).toBeNull();
    });

    it('should select status filter when set', () => {
      const filteredState: TodosState = {
        ...mockState,
        statusFilter: TodoItemStatus.Done,
      };
      const result =
        TodosSelectors.selectStatusFilter.projector(filteredState);
      expect(result).toBe(TodoItemStatus.Done);
    });
  });

  describe('selectSearchTerm', () => {
    it('should select search term', () => {
      const result = TodosSelectors.selectSearchTerm.projector(mockState);
      expect(result).toBe('');
    });

    it('should select search term when set', () => {
      const searchState: TodosState = {
        ...mockState,
        searchTerm: 'groceries',
      };
      const result = TodosSelectors.selectSearchTerm.projector(searchState);
      expect(result).toBe('groceries');
    });
  });

  describe('selectTodoById', () => {
    it('should select todo by id', () => {
      const selector = TodosSelectors.selectTodoById('2');
      const result = selector.projector(mockTodos);
      expect(result).toEqual(mockTodos[1]);
    });

    it('should return undefined for non-existent id', () => {
      const selector = TodosSelectors.selectTodoById('999');
      const result = selector.projector(mockTodos);
      expect(result).toBeUndefined();
    });
  });
});