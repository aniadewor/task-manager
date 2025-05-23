import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../task.service';
import { Router } from '@angular/router';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private taskService: TaskService, private router: Router) {}

  async addTask() {
    await this.taskService.addTask(this.task as Task);
    this.router.navigate(['/dashboard']);
  }
}
