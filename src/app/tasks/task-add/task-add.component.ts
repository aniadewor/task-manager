import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../task.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from '../../models/task.model';


@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [CommonModule, FormsModule,   MatFormFieldModule,
  MatInputModule,
  MatButtonModule],
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.scss']
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
  ownerId: '', // zostanie uzupełniony w metodzie addTask
};
  @Output() taskAdded = new EventEmitter<void>();

  constructor(private taskService: TaskService, private router: Router, private snackBar: MatSnackBar
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
