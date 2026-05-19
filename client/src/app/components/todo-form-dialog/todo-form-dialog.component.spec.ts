import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TodoFormDialogComponent } from './todo-form-dialog.component';
import { TodoItem } from '../../models/todo-item.model';
import { TodoItemStatus } from '../../models/todo-item-status.enum';
import * as TodosActions from '../../store/todos/todos.actions';

describe('TodoFormDialogComponent', () => {
  let component: TodoFormDialogComponent;
  let fixture: ComponentFixture<TodoFormDialogComponent>;
  let store: MockStore;
  let dialogRef: jest.Mocked<MatDialogRef<TodoFormDialogComponent>>;

  const mockTodo: TodoItem = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    dueDate: '2024-12-31T00:00:00Z',
    status: TodoItemStatus.Todo,
    createdAtUtc: '2024-01-01T00:00:00Z',
  };

  const setupComponent = (data: TodoItem | null = null) => {
    const mockDialogRef = {
      close: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [
        TodoFormDialogComponent,
        ReactiveFormsModule,
        MatDialogModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideMockStore(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
      ],
    });

    store = TestBed.inject(MockStore);
    dialogRef = TestBed.inject(
      MatDialogRef,
    ) as jest.Mocked<MatDialogRef<TodoFormDialogComponent>>;
    fixture = TestBed.createComponent(TodoFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  describe('Create Mode', () => {
    beforeEach(() => {
      setupComponent(null);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize in create mode', () => {
      expect(component.isEditMode).toBe(false);
    });

    it('should initialize empty form', () => {
      expect(component.todoForm.value).toEqual({
        title: '',
        description: '',
        dueDate: null,
      });
    });

    it('should have invalid form when title is empty', () => {
      expect(component.todoForm.valid).toBe(false);
    });

    it('should have valid form when title is filled', () => {
      component.todoForm.patchValue({ title: 'New Todo' });
      expect(component.todoForm.valid).toBe(true);
    });

    it('should dispatch createTodo action on submit', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.todoForm.patchValue({
        title: 'New Todo',
        description: 'New Description',
        dueDate: new Date('2024-12-31'),
      });

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        TodosActions.createTodo({
          request: {
            title: 'New Todo',
            description: 'New Description',
            dueDate: expect.any(String),
          },
        }),
      );
      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should not submit invalid form', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.todoForm.patchValue({ title: '' });

      component.onSubmit();

      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      setupComponent(mockTodo);
    });

    it('should initialize in edit mode', () => {
      expect(component.isEditMode).toBe(true);
    });

    it('should populate form with todo data', () => {
      expect(component.todoForm.value.title).toBe(mockTodo.title);
      expect(component.todoForm.value.description).toBe(mockTodo.description);
      expect(component.todoForm.value.dueDate).toBeInstanceOf(Date);
    });

    it('should dispatch updateTodo action on submit', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.todoForm.patchValue({
        title: 'Updated Todo',
        description: 'Updated Description',
        dueDate: new Date('2024-12-31'),
      });

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        TodosActions.updateTodo({
          id: mockTodo.id,
          request: {
            title: 'Updated Todo',
            description: 'Updated Description',
            dueDate: expect.any(String),
          },
        }),
      );
      expect(dialogRef.close).toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      setupComponent(null);
    });

    it('should require title', () => {
      const titleControl = component.todoForm.get('title');
      expect(titleControl?.hasError('required')).toBe(true);

      titleControl?.setValue('Test');
      expect(titleControl?.hasError('required')).toBe(false);
    });

    it('should enforce max length on title', () => {
      const titleControl = component.todoForm.get('title');
      const longTitle = 'a'.repeat(201);

      titleControl?.setValue(longTitle);
      expect(titleControl?.hasError('maxlength')).toBe(true);

      titleControl?.setValue('Valid Title');
      expect(titleControl?.hasError('maxlength')).toBe(false);
    });

    it('should enforce max length on description', () => {
      const descControl = component.todoForm.get('description');
      const longDesc = 'a'.repeat(1001);

      descControl?.setValue(longDesc);
      expect(descControl?.hasError('maxlength')).toBe(true);

      descControl?.setValue('Valid Description');
      expect(descControl?.hasError('maxlength')).toBe(false);
    });

    it('should allow null description', () => {
      component.todoForm.patchValue({
        title: 'Test',
        description: null,
      });
      expect(component.todoForm.valid).toBe(true);
    });

    it('should convert null description to null in request', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');
      component.todoForm.patchValue({
        title: 'Test',
        description: '',
        dueDate: null,
      });

      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        TodosActions.createTodo({
          request: {
            title: 'Test',
            description: null,
            dueDate: null,
          },
        }),
      );
    });
  });

  describe('onCancel', () => {
    beforeEach(() => {
      setupComponent(null);
    });

    it('should close dialog without dispatching actions', () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      component.onCancel();

      expect(dialogRef.close).toHaveBeenCalled();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });
});
