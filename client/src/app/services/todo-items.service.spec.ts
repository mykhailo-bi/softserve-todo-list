import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TodoItemsService } from './todo-items.service';
import { TodoItemStatus } from '../models/todo-item-status.enum';
import { TodoItem } from '../models/todo-item.model';

describe('TodoItemsService', () => {
  let service: TodoItemsService;
  let httpMock: HttpTestingController;
  const apiUrl = '/api/TodoItems';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TodoItemsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should fetch all todos without filter', () => {
      const mockTodos: TodoItem[] = [
        {
          id: '1',
          title: 'Test Todo',
          description: 'Test Description',
          dueDate: null,
          status: TodoItemStatus.Todo,
          createdAtUtc: '2024-01-01T00:00:00Z',
        },
      ];

      service.getAll().subscribe((todos) => {
        expect(todos).toEqual(mockTodos);
        expect(todos.length).toBe(1);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.keys().length).toBe(0);
      req.flush(mockTodos);
    });

    it('should fetch todos with status filter', () => {
      const mockTodos: TodoItem[] = [
        {
          id: '1',
          title: 'In Progress Todo',
          description: null,
          dueDate: null,
          status: TodoItemStatus.InProgress,
          createdAtUtc: '2024-01-01T00:00:00Z',
        },
      ];

      service.getAll(TodoItemStatus.InProgress).subscribe((todos) => {
        expect(todos).toEqual(mockTodos);
      });

      const req = httpMock.expectOne(`${apiUrl}?status=1`);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('status')).toBe('1');
      req.flush(mockTodos);
    });
  });

  describe('create', () => {
    it('should create a new todo', () => {
      const request = {
        title: 'New Todo',
        description: 'New Description',
        dueDate: '2024-12-31T00:00:00Z',
      };
      const mockId = '123e4567-e89b-12d3-a456-426614174000';

      service.create(request).subscribe((id) => {
        expect(id).toBe(mockId);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockId);
    });
  });

  describe('update', () => {
    it('should update an existing todo', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const request = {
        title: 'Updated Todo',
        description: 'Updated Description',
        dueDate: null,
      };

      service.update(id, request).subscribe((response) => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(request);
      req.flush(null);
    });
  });

  describe('changeStatus', () => {
    it('should change todo status', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const request = { status: TodoItemStatus.Done };

      service.changeStatus(id, request).subscribe((response) => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}/status`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(request);
      req.flush(null);
    });
  });

  describe('delete', () => {
    it('should delete a todo', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';

      service.delete(id).subscribe((response) => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/${id}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('error handling', () => {
    it('should handle HTTP errors', () => {
      const errorMessage = 'Server error';

      service.getAll().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });
});
