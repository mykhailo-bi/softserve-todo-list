import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TodoListComponent } from './todo-list.component';
import * as TodosActions from '../../store/todos/todos.actions';
import * as TodosSelectors from '../../store/todos/todos.selectors';
import { TodoItemStatus } from '../../models/todo-item-status.enum';
import { TodoItem } from '../../models/todo-item.model';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let store: MockStore;
  let dialog: MatDialog;

  const mockTodos: TodoItem[] = [
    {
      id: '1',
      title: 'Test Todo 1',
      description: 'Description 1',
      dueDate: null,
      status: TodoItemStatus.Todo,
      createdAtUtc: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Test Todo 2',
      description: null,
      dueDate: '2024-12-31T00:00:00Z',
      status: TodoItemStatus.InProgress,
      createdAtUtc: '2024-01-02T00:00:00Z',
    },
  ];

  const initialState = {
    todos: {
      todos: mockTodos,
      loading: false,
      error: null,
      statusFilter: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent, MatDialogModule, NoopAnimationsModule],
      providers: [
        provideRouter([]),
        provideLocationMocks(),
        provideNativeDateAdapter(),
        provideMockStore({
          initialState,
          selectors: [
            { selector: TodosSelectors.selectFilteredTodos, value: mockTodos },
            { selector: TodosSelectors.selectTodosLoading, value: false },
            { selector: TodosSelectors.selectTodosError, value: null },
            { selector: TodosSelectors.selectStatusFilter, value: null },
          ],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadTodos on init', () => {
    const dispatchSpy = jest.spyOn(store, 'dispatch');
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(TodosActions.loadTodos({}));
  });

  it('should display todos from store', (done) => {
    fixture.detectChanges();

    component.todos$.subscribe((todos) => {
      expect(todos).toEqual(mockTodos);
      expect(todos.length).toBe(2);
      done();
    });
  });

  it('should display loading state', (done) => {
    store.overrideSelector(TodosSelectors.selectTodosLoading, true);
    store.refreshState();
    fixture.detectChanges();

    component.loading$.subscribe((loading) => {
      expect(loading).toBe(true);
      done();
    });
  });

  it('should display error state', (done) => {
    const error = 'Something went wrong';
    store.overrideSelector(TodosSelectors.selectTodosError, error);
    store.refreshState();
    fixture.detectChanges();

    component.error$.subscribe((err) => {
      expect(err).toBe(error);
      done();
    });
  });

  describe('onFilterChange', () => {
    it('should dispatch setStatusFilter with selected status', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const status = TodoItemStatus.InProgress;

      component.onFilterChange(status);

      expect(dispatchSpy).toHaveBeenCalledWith(
        TodosActions.setStatusFilter({ status }),
      );
    });

    it('should dispatch setStatusFilter with null', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onFilterChange(null);

      expect(dispatchSpy).toHaveBeenCalledWith(
        TodosActions.setStatusFilter({ status: null }),
      );
    });
  });

  describe('onAddClick', () => {
    it('should open dialog with null data', () => {
      const dialogSpy = jest.spyOn(dialog, 'open');

      component.onAddClick();

      expect(dialogSpy).toHaveBeenCalledWith(expect.any(Function), {
        width: '500px',
        data: null,
      });
    });
  });

  describe('status options', () => {
    it('should have all status options', () => {
      expect(component.statusOptions).toContain(TodoItemStatus.Todo);
      expect(component.statusOptions).toContain(TodoItemStatus.InProgress);
      expect(component.statusOptions).toContain(TodoItemStatus.Done);
      expect(component.statusOptions.length).toBe(3);
    });

    it('should have status labels', () => {
      expect(component.statusLabels[TodoItemStatus.Todo]).toBe('To Do');
      expect(component.statusLabels[TodoItemStatus.InProgress]).toBe(
        'In Progress',
      );
      expect(component.statusLabels[TodoItemStatus.Done]).toBe('Done');
    });
  });
});
