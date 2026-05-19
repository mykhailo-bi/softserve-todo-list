import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { TodoItem } from '../../models/todo-item.model';
import {
  TodoItemStatus,
  TodoItemStatusLabels,
} from '../../models/todo-item-status.enum';
import { TodoFormDialogComponent } from '../todo-form-dialog/todo-form-dialog.component';
import * as TodosActions from '../../store/todos/todos.actions';

@Component({
  selector: 'app-todo-item',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  todo = input.required<TodoItem>();

  protected readonly TodoItemStatus = TodoItemStatus;
  protected readonly statusLabels = TodoItemStatusLabels;

  getStatusClass(status: TodoItemStatus): string {
    switch (status) {
      case TodoItemStatus.Todo:
        return 'status-todo';
      case TodoItemStatus.InProgress:
        return 'status-in-progress';
      case TodoItemStatus.Done:
        return 'status-done';
      default:
        return '';
    }
  }

  getStatusIcon(status: TodoItemStatus): string {
    switch (status) {
      case TodoItemStatus.Todo:
        return 'radio_button_unchecked';
      case TodoItemStatus.InProgress:
        return 'pending';
      case TodoItemStatus.Done:
        return 'check_circle';
      default:
        return 'radio_button_unchecked';
    }
  }

  onStatusChange(status: TodoItemStatus): void {
    this.store.dispatch(
      TodosActions.changeTodoStatus({ id: this.todo().id, status }),
    );
  }

  onEdit(): void {
    this.dialog.open(TodoFormDialogComponent, {
      width: '500px',
      data: this.todo(),
    });
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.store.dispatch(TodosActions.deleteTodo({ id: this.todo().id }));
    }
  }

  formatDate(date: string | null): string {
    if (!date) return 'No due date';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  isOverdue(date: string | null): boolean {
    if (!date) return false;
    return new Date(date) < new Date() && this.todo().status !== TodoItemStatus.Done;
  }
}
