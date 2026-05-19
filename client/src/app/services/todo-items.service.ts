import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TodoItem,
  CreateTodoItemRequest,
  UpdateTodoItemRequest,
  ChangeTodoItemStatusRequest,
} from '../models/todo-item.model';
import { TodoItemStatus } from '../models/todo-item-status.enum';

@Injectable({
  providedIn: 'root',
})
export class TodoItemsService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl =
    (globalThis as { NG_APP_API_BASE_URL?: string }).NG_APP_API_BASE_URL ||
    '';
  private readonly apiUrl = `${this.apiBaseUrl}/api/TodoItems`;

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  getAll(status?: TodoItemStatus): Observable<TodoItem[]> {
    let params = new HttpParams();
    if (status !== undefined && status !== null) {
      params = params.set('status', status.toString());
    }
    return this.http.get<TodoItem[]>(this.apiUrl, { params });
  }

  create(request: CreateTodoItemRequest): Observable<string> {
    return this.http.post<string>(this.apiUrl, request, this.httpOptions);
  }

  update(id: string, request: UpdateTodoItemRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request, this.httpOptions);
  }

  changeStatus(
    id: string,
    request: ChangeTodoItemStatusRequest,
  ): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, request, this.httpOptions);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
