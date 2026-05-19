import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TodoItem } from '../../models/todo-item.model';
import * as TodosActions from '../../store/todos/todos.actions';

@Component({
  selector: 'app-todo-form-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  templateUrl: './todo-form-dialog.component.html',
  styleUrl: './todo-form-dialog.component.scss',
})
export class TodoFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly dialogRef = inject(MatDialogRef<TodoFormDialogComponent>);
protected readonly data = inject<TodoItem | null>(MAT_DIALOG_DATA);

  protected todoForm!: FormGroup;
  protected isEditMode = false;
  protected readonly today = new Date();

  protected dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    const todayStart = new Date(this.today);
    todayStart.setHours(0, 0, 0, 0);
    const dateStart = new Date(date);
    dateStart.setHours(0, 0, 0, 0);
    return dateStart >= todayStart;
  };

  ngOnInit(): void {
    this.isEditMode = !!this.data;
    this.initForm();
  }

  private initForm(): void {
    this.todoForm = this.fb.group({
      title: [
        this.data?.title || '',
        [Validators.required, Validators.maxLength(200)],
      ],
      description: [this.data?.description || '', [Validators.maxLength(1000)]],
      dueDate: [this.data?.dueDate ? new Date(this.data.dueDate) : this.today],
    });
  }

  onSubmit(): void {
    if (this.todoForm.invalid) {
      return;
    }

    const formValue = this.todoForm.value;
    const request = {
      title: formValue.title,
      description: formValue.description || null,
      dueDate: formValue.dueDate ? formValue.dueDate.toISOString() : null,
    };

    if (this.isEditMode && this.data) {
      this.store.dispatch(
        TodosActions.updateTodo({ id: this.data.id, request }),
      );
    } else {
      this.store.dispatch(TodosActions.createTodo({ request }));
    }

    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
