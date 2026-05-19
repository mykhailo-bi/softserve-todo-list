import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { Action } from '@ngrx/store';
import { TodosEffects } from './todos.effects';
import { TodoItemsService } from '../../services/todo-items.service';
import * as TodosActions from './todos.actions';
import { TodoItemStatus } from '../../models/todo-item-status.enum';
import { TodoItem } from '../../models/todo-item.model';

describe('TodosEffects', () => {
  let actions$: Observable<Action>;
  let effects: TodosEffects;
  let todoItemsService: jest.Mocked<TodoItemsService>;

  const mockTodo: TodoItem = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    dueDate: null,
    status: TodoItemStatus.Todo,
    createdAtUtc: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    const todoItemsServiceMock = {
      getAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      changeStatus: jest.fn(),
      delete: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        TodosEffects,
        provideMockActions(() => actions$),
        { provide: TodoItemsService, useValue: todoItemsServiceMock },
      ],
    });

    effects = TestBed.inject(TodosEffects);
    todoItemsService = TestBed.inject(
      TodoItemsService,
    ) as jest.Mocked<TodoItemsService>;
  });

  describe('loadTodos$', () => {
    it('should return loadTodosSuccess on success', (done) => {
      const todos = [mockTodo];
      todoItemsService.getAll.mockReturnValue(of(todos));

      actions$ = of(TodosActions.loadTodos({}));

      effects.loadTodos$.subscribe((action) => {
        expect(action).toEqual(TodosActions.loadTodosSuccess({ todos }));
        expect(todoItemsService.getAll).toHaveBeenCalledWith(undefined);
        done();
      });
    });

    it('should return loadTodosFailure on error', (done) => {
      const error = new Error('Failed to load');
      todoItemsService.getAll.mockReturnValue(throwError(() => error));

      actions$ = of(TodosActions.loadTodos({}));

      effects.loadTodos$.subscribe((action) => {
        expect(action).toEqual(
          TodosActions.loadTodosFailure({ error: error.message }),
        );
        done();
      });
    });

    it('should pass status filter to service', (done) => {
      todoItemsService.getAll.mockReturnValue(of([]));

      actions$ = of(
        TodosActions.loadTodos({ status: TodoItemStatus.InProgress }),
      );

      effects.loadTodos$.subscribe(() => {
        expect(todoItemsService.getAll).toHaveBeenCalledWith(
          TodoItemStatus.InProgress,
        );
        done();
      });
    });
  });

  describe('createTodo$', () => {
    it('should return createTodoSuccess on success', (done) => {
      const request = { title: 'New', description: null, dueDate: null };
      const id = 'new-id';
      todoItemsService.create.mockReturnValue(of(id));

      actions$ = of(TodosActions.createTodo({ request }));

      effects.createTodo$.subscribe((action) => {
        expect(action).toEqual(TodosActions.createTodoSuccess({ id }));
        expect(todoItemsService.create).toHaveBeenCalledWith(request);
        done();
      });
    });

    it('should return createTodoFailure on error', (done) => {
      const request = { title: 'New', description: null, dueDate: null };
      const error = new Error('Failed to create');
      todoItemsService.create.mockReturnValue(throwError(() => error));

      actions$ = of(TodosActions.createTodo({ request }));

      effects.createTodo$.subscribe((action) => {
        expect(action).toEqual(
          TodosActions.createTodoFailure({ error: error.message }),
        );
        done();
      });
    });
  });

  describe('createTodoSuccess$', () => {
    it('should trigger loadTodos after create success', (done) => {
      actions$ = of(TodosActions.createTodoSuccess({ id: '1' }));

      effects.createTodoSuccess$.subscribe((action) => {
        expect(action).toEqual(TodosActions.loadTodos({}));
        done();
      });
    });
  });

  describe('updateTodo$', () => {
    it('should return updateTodoSuccess on success', (done) => {
      const id = '1';
      const request = { title: 'Updated', description: null, dueDate: null };
      todoItemsService.update.mockReturnValue(of(undefined));

      actions$ = of(TodosActions.updateTodo({ id, request }));

      effects.updateTodo$.subscribe((action) => {
        expect(action).toEqual(TodosActions.updateTodoSuccess());
        expect(todoItemsService.update).toHaveBeenCalledWith(id, request);
        done();
      });
    });

    it('should return updateTodoFailure on error', (done) => {
      const id = '1';
      const request = { title: 'Updated', description: null, dueDate: null };
      const error = new Error('Failed to update');
      todoItemsService.update.mockReturnValue(throwError(() => error));

      actions$ = of(TodosActions.updateTodo({ id, request }));

      effects.updateTodo$.subscribe((action) => {
        expect(action).toEqual(
          TodosActions.updateTodoFailure({ error: error.message }),
        );
        done();
      });
    });
  });

  describe('changeTodoStatus$', () => {
    it('should return changeTodoStatusSuccess on success', (done) => {
      const id = '1';
      const status = TodoItemStatus.Done;
      todoItemsService.changeStatus.mockReturnValue(of(undefined));

      actions$ = of(TodosActions.changeTodoStatus({ id, status }));

      effects.changeTodoStatus$.subscribe((action) => {
        expect(action).toEqual(TodosActions.changeTodoStatusSuccess());
        expect(todoItemsService.changeStatus).toHaveBeenCalledWith(id, {
          status,
        });
        done();
      });
    });

    it('should return changeTodoStatusFailure on error', (done) => {
      const id = '1';
      const status = TodoItemStatus.Done;
      const error = new Error('Failed to change status');
      todoItemsService.changeStatus.mockReturnValue(throwError(() => error));

      actions$ = of(TodosActions.changeTodoStatus({ id, status }));

      effects.changeTodoStatus$.subscribe((action) => {
        expect(action).toEqual(
          TodosActions.changeTodoStatusFailure({ error: error.message }),
        );
        done();
      });
    });
  });

  describe('deleteTodo$', () => {
    it('should return deleteTodoSuccess on success', (done) => {
      const id = '1';
      todoItemsService.delete.mockReturnValue(of(undefined));

      actions$ = of(TodosActions.deleteTodo({ id }));

      effects.deleteTodo$.subscribe((action) => {
        expect(action).toEqual(TodosActions.deleteTodoSuccess());
        expect(todoItemsService.delete).toHaveBeenCalledWith(id);
        done();
      });
    });

    it('should return deleteTodoFailure on error', (done) => {
      const id = '1';
      const error = new Error('Failed to delete');
      todoItemsService.delete.mockReturnValue(throwError(() => error));

      actions$ = of(TodosActions.deleteTodo({ id }));

      effects.deleteTodo$.subscribe((action) => {
        expect(action).toEqual(
          TodosActions.deleteTodoFailure({ error: error.message }),
        );
        done();
      });
    });
  });

  describe('success effects', () => {
    it('should trigger loadTodos after updateTodoSuccess', (done) => {
      actions$ = of(TodosActions.updateTodoSuccess());

      effects.updateTodoSuccess$.subscribe((action) => {
        expect(action).toEqual(TodosActions.loadTodos({}));
        done();
      });
    });

    it('should trigger loadTodos after changeTodoStatusSuccess', (done) => {
      actions$ = of(TodosActions.changeTodoStatusSuccess());

      effects.changeTodoStatusSuccess$.subscribe((action) => {
        expect(action).toEqual(TodosActions.loadTodos({}));
        done();
      });
    });

    it('should trigger loadTodos after deleteTodoSuccess', (done) => {
      actions$ = of(TodosActions.deleteTodoSuccess());

      effects.deleteTodoSuccess$.subscribe((action) => {
        expect(action).toEqual(TodosActions.loadTodos({}));
        done();
      });
    });
  });
});
