import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoFormDialogComponent } from '../todo-form-dialog/todo-form-dialog.component';
import * as TodosActions from '../../store/todos/todos.actions';
import * as TodosSelectors from '../../store/todos/todos.selectors';
import {
  TodoItemStatus,
  TodoItemStatusLabels,
} from '../../models/todo-item-status.enum';

@Component({
  selector: 'app-todo-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    TodoItemComponent,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly searchSubject = new Subject<string>();
  private readonly searchSubscription = this.searchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged(),
  ).subscribe((term) => {
    this.store.dispatch(TodosActions.setSearchTerm({ searchTerm: term }));
  });

  protected readonly todos$ = this.store.select(
    TodosSelectors.selectFilteredTodos,
  );
  protected readonly loading$ = this.store.select(
    TodosSelectors.selectTodosLoading,
  );
  protected readonly error$ = this.store.select(TodosSelectors.selectTodosError);
  protected readonly statusFilter$ = this.store.select(
    TodosSelectors.selectStatusFilter,
  );
  protected readonly searchTerm$ = this.store.select(
    TodosSelectors.selectSearchTerm,
  );

  protected readonly TodoItemStatus = TodoItemStatus;
  protected readonly statusLabels = TodoItemStatusLabels;
  protected readonly statusOptions = Object.values(TodoItemStatus).filter(
    (v) => typeof v === 'number',
  ) as TodoItemStatus[];

  ngOnInit(): void {
    const statusParam = this.route.snapshot.queryParamMap.get('status');
    if (statusParam !== null) {
      const status = Number(statusParam) as TodoItemStatus;
      if (this.statusOptions.includes(status)) {
        this.store.dispatch(TodosActions.setStatusFilter({ status }));
      }
    }

    this.store.dispatch(TodosActions.loadTodos({}));
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
  }

  onFilterChange(status: TodoItemStatus | null): void {
    this.store.dispatch(TodosActions.setStatusFilter({ status }));
    const queryParams: Record<string, string> = {};
    if (status !== null) {
      queryParams['status'] = String(status);
    }
    this.router.navigate([], { queryParams });
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  onAddClick(): void {
    const dialogRef = this.dialog.open(TodoFormDialogComponent, {
      width: '500px',
      data: null,
    });
  }
}