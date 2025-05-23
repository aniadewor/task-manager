import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../task.service';
import { Router } from '@angular/router';
import { Task } from '../../models/task.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Output, EventEmitter } from '@angular/core';

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
  task: Partial<Task> = {
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date(),
    tags: []
  };
  @Output() taskAdded = new EventEmitter<void>();

  constructor(private taskService: TaskService, private router: Router) {}

  async addTask() {
    await this.taskService.addTask(this.task as Task);
    this.router.navigate(['/dashboard']);
    this.taskAdded.emit();

  }
}
