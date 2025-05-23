import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../task.service';
import { Task } from '../../models/task.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-add',
  standalone: true,
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class TaskAddComponent {
  task: Task = {
    title: '',
    description: '',
    priority: 'low',
    status: 'todo',
    dueDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
    ownerId: ''
  };

  @Output() taskAdded = new EventEmitter<void>();

  constructor(
    private taskService: TaskService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async addTask() {
    try {
      await this.taskService.addTask(this.task);
      this.snackBar.open('✅ Zadanie zostało dodane!', 'Zamknij', {
        duration: 3000
      });
      this.router.navigate(['/tasks']);
    } catch (error) {
      console.error('❌ Błąd dodawania zadania:', error);
      this.snackBar.open('❌ Nie udało się dodać zadania', 'Zamknij', {
        duration: 4000
      });
    }
  }
}
