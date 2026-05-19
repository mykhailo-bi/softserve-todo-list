import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { signal } from '@angular/core';
import { TodoItemComponent } from './todo-item.component';
import { TodoItem } from '../../models/todo-item.model';
import { TodoItemStatus } from '../../models/todo-item-status.enum';
import * as TodosActions from '../../store/todos/todos.actions';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;
  let store: MockStore;
  let dialog: MatDialog;

  const mockTodo: TodoItem = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    dueDate: '2024-12-31T00:00:00Z',
    status: TodoItemStatus.Todo,
    createdAtUtc: '2024-01-01T00:00:00Z',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent, MatDialogModule],
      providers: [provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dialog = TestBed.inject(MatDialog);
    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('todo', mockTodo);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display todo data', () => {
    expect(component.todo()).toEqual(mockTodo);
  });

  describe('getStatusClass', () => {
    it('should return correct class for Todo status', () => {
      expect(component.getStatusClass(TodoItemStatus.Todo)).toBe('status-todo');
    });

    it('should return correct class for InProgress status', () => {
      expect(component.getStatusClass(TodoItemStatus.InProgress)).toBe(
        'status-in-progress',
      );
    });

    it('should return correct class for Done status', () => {
      expect(component.getStatusClass(TodoItemStatus.Done)).toBe('status-done');
    });
  });

  describe('getStatusIcon', () => {
    it('should return correct icon for Todo status', () => {
      expect(component.getStatusIcon(TodoItemStatus.Todo)).toBe(
        'radio_button_unchecked',
      );
    });

    it('should return correct icon for InProgress status', () => {
      expect(component.getStatusIcon(TodoItemStatus.InProgress)).toBe(
        'pending',
      );
    });

    it('should return correct icon for Done status', () => {
      expect(component.getStatusIcon(TodoItemStatus.Done)).toBe(
        'check_circle',
      );
    });
  });

  describe('onStatusChange', () => {
    it('should dispatch changeTodoStatus action', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      const newStatus = TodoItemStatus.InProgress;

      component.onStatusChange(newStatus);

      expect(dispatchSpy).toHaveBeenCalledWith(
        TodosActions.changeTodoStatus({ id: mockTodo.id, status: newStatus }),
      );
    });
  });

  describe('onEdit', () => {
    it('should open dialog with todo data', () => {
      const dialogSpy = jest.spyOn(dialog, 'open');

      component.onEdit();

      expect(dialogSpy).toHaveBeenCalledWith(expect.any(Function), {
        width: '500px',
        data: mockTodo,
      });
    });
  });

  describe('onDelete', () => {
    it('should dispatch deleteTodo action when confirmed', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      global.confirm = jest.fn(() => true);

      component.onDelete();

      expect(dispatchSpy).toHaveBeenCalledWith(
        TodosActions.deleteTodo({ id: mockTodo.id }),
      );
    });

    it('should not dispatch deleteTodo action when cancelled', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      global.confirm = jest.fn(() => false);

      component.onDelete();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = '2024-12-31T00:00:00Z';
      const formatted = component.formatDate(date);
      expect(formatted).toMatch(/Dec 3[01], 2024/); // Account for timezone
    });

    it('should return "No due date" for null', () => {
      expect(component.formatDate(null)).toBe('No due date');
    });
  });

  describe('isOverdue', () => {
    it('should return true for past dates when not done', () => {
      const pastDate = '2020-01-01T00:00:00Z';
      fixture.componentRef.setInput('todo', {
        ...mockTodo,
        dueDate: pastDate,
        status: TodoItemStatus.Todo,
      });
      fixture.detectChanges();

      expect(component.isOverdue(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString();

      expect(component.isOverdue(futureDateString)).toBe(false);
    });

    it('should return false when status is Done', () => {
      const pastDate = '2020-01-01T00:00:00Z';
      fixture.componentRef.setInput('todo', {
        ...mockTodo,
        dueDate: pastDate,
        status: TodoItemStatus.Done,
      });
      fixture.detectChanges();

      expect(component.isOverdue(pastDate)).toBe(false);
    });

    it('should return false for null date', () => {
      expect(component.isOverdue(null)).toBe(false);
    });
  });

  describe('status labels', () => {
    it('should have correct status labels', () => {
      expect(component.statusLabels[TodoItemStatus.Todo]).toBe('To Do');
      expect(component.statusLabels[TodoItemStatus.InProgress]).toBe(
        'In Progress',
      );
      expect(component.statusLabels[TodoItemStatus.Done]).toBe('Done');
    });
  });
});
