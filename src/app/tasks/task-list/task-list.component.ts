import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // MUSI być!
import { TaskService } from '../../task.service';
import { Task } from '../../models/task.model';
import { UserService } from '../../user.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
     MatCardModule,
  MatButtonModule,
  MatSelectModule,
  MatFormFieldModule// <-- to MUSI tu być
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  userRole: string = 'user';
  currentUserId: string | null = null;
  filterStatus: string = 'all';
sortBy: string = 'createdAt';


  constructor(private taskService: TaskService, private userService: UserService) {}

 async ngOnInit() {
  this.currentUserId = this.taskService.getCurrentUserId();
  const userData = await this.userService.getCurrentUserData();
  this.userRole = userData?.role || 'user';

  if (this.userRole === 'admin') {
    this.tasks = await this.taskService.getAllTasks();
  } else {
    this.tasks = await this.taskService.getTasksByOwner();
  }

  this.applyFilters();
}

  async deleteTask(task: Task) {
    await this.taskService.deleteTask(task.id!);
    this.tasks = this.tasks.filter(t => t.id !== task.id);
  }

async markAsDone(task: Task) {
  await this.taskService.updateTask(task.id!, {
    status: 'done',
    completedAt: new Date()
  });
  task.status = 'done'; // odświeżenie widoku bez reloadu
}
applyFilters(): void {
  let filtered = [...this.tasks];

  if (this.filterStatus !== 'all') {
    filtered = filtered.filter(task => task.status === this.filterStatus);
  }

  if (this.sortBy === 'createdAt') {
    filtered.sort((a: Task, b: Task) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  } else if (this.sortBy === 'priority') {
    const priorityOrder: { [key: string]: number } = { high: 1, medium: 2, low: 3 };
    filtered.sort((a: Task, b: Task) => {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  this.tasks = filtered;
}

}

