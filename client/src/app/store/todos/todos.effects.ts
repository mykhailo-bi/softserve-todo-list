import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { TodoItemsService } from '../../services/todo-items.service';
import * as TodosActions from './todos.actions';

@Injectable()
export class TodosEffects {
  private readonly actions$ = inject(Actions);
  private readonly todoItemsService = inject(TodoItemsService);

  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.loadTodos),
      switchMap(({ status }) =>
        this.todoItemsService.getAll(status).pipe(
          map((todos) => TodosActions.loadTodosSuccess({ todos })),
          catchError((error) =>
            of(
              TodosActions.loadTodosFailure({
                error: error.message || 'Failed to load todos',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.createTodo),
      mergeMap(({ request }) =>
        this.todoItemsService.create(request).pipe(
          map((id) => TodosActions.createTodoSuccess({ id })),
          catchError((error) =>
            of(
              TodosActions.createTodoFailure({
                error: error.message || 'Failed to create todo',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createTodoSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.createTodoSuccess),
      map(() => TodosActions.loadTodos({})),
    ),
  );

  updateTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.updateTodo),
      mergeMap(({ id, request }) =>
        this.todoItemsService.update(id, request).pipe(
          map(() => TodosActions.updateTodoSuccess()),
          catchError((error) =>
            of(
              TodosActions.updateTodoFailure({
                error: error.message || 'Failed to update todo',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateTodoSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.updateTodoSuccess),
      map(() => TodosActions.loadTodos({})),
    ),
  );

  changeTodoStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.changeTodoStatus),
      mergeMap(({ id, status }) =>
        this.todoItemsService.changeStatus(id, { status }).pipe(
          map(() => TodosActions.changeTodoStatusSuccess()),
          catchError((error) =>
            of(
              TodosActions.changeTodoStatusFailure({
                error: error.message || 'Failed to change status',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  changeTodoStatusSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.changeTodoStatusSuccess),
      map(() => TodosActions.loadTodos({})),
    ),
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.deleteTodo),
      mergeMap(({ id }) =>
        this.todoItemsService.delete(id).pipe(
          map(() => TodosActions.deleteTodoSuccess()),
          catchError((error) =>
            of(
              TodosActions.deleteTodoFailure({
                error: error.message || 'Failed to delete todo',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteTodoSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodosActions.deleteTodoSuccess),
      map(() => TodosActions.loadTodos({})),
    ),
  );
}
