import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../task.service';
import { Task } from '../../models/task.model';
import { UserService } from '../../user.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';

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
    MatFormFieldModule,
    MatSnackBarModule
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
  auth = inject(Auth);

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {}

  async ngOnInit() {
    this.loadTasks();
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
    try {
      await this.taskService.deleteTask(task.id!);
      this.snackBar.open('🗑 Zadanie usunięte!', 'Zamknij', { duration: 3000 });
      this.loadTasks();
    } catch (error) {
      console.error('Błąd przy usuwaniu:', error);
      this.snackBar.open('❌ Nie udało się usunąć zadania', 'Zamknij', { duration: 4000 });
    }
  }

  async markAsDone(task: Task) {
    try {
      const updatedTask: Partial<Task> = {
        ...task,
        status: 'done' as 'done',
        completedAt: new Date(),
        updatedAt: new Date()
      };

      await this.taskService.updateTask(task.id!, updatedTask);
      this.snackBar.open('✅ Zadanie oznaczone jako ukończone!', 'Zamknij', { duration: 3000 });
      this.loadTasks();
    } catch (error) {
      console.error('Błąd przy aktualizacji:', error);
      this.snackBar.open('❌ Nie udało się zaktualizować zadania', 'Zamknij', { duration: 4000 });
    }
  }

  applyFilters(): void {
    let filtered = [...this.tasks];

    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === this.filterStatus);
    }

    if (this.sortBy === 'createdAt') {
      filtered.sort((a: Task, b: Task) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (this.sortBy === 'priority') {
      const priorityOrder: { [key: string]: number } = { high: 1, medium: 2, low: 3 };
      filtered.sort((a: Task, b: Task) =>
        priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }

    this.tasks = filtered;
  }

  async loadTasks() {
    try {
      const user = await this.auth.currentUser;
      if (!user) return;

      const allTasks = await this.taskService.getAllTasks();
      const userData = await this.userService.getCurrentUserData();

      this.currentUserId = user.uid;
      this.userRole = userData?.role || 'user';

      this.tasks = allTasks.filter(task =>
        this.userRole === 'admin' || task.ownerId === user.uid
      );

      this.applyFilters();
    } catch (error) {
      console.error('Błąd podczas ładowania zadań:', error);
      this.snackBar.open('❌ Nie udało się załadować zadań', 'Zamknij', {
        duration: 4000
      });
    }
  }
}