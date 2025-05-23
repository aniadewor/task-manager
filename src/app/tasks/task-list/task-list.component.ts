import { Component, OnInit, inject } from '@angular/core';
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
import { User } from '../../models/user.model';

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
  allTasks: Task[] = [];
  userRole: string = 'user';
  currentUserId: string | null = null;
  filterStatus: string = 'all';
  sortBy: string = 'createdAt';
  filterUser: string = 'all';
  users: User[] = [];
  auth = inject(Auth);

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    try {
      const user = await this.auth.currentUser;
      if (!user) return;

      const userData = await this.userService.getCurrentUserData();
      this.userRole = userData?.role || 'user';
      this.currentUserId = user.uid;

      this.allTasks = await this.taskService.getAllTasks();

      if (this.userRole === 'admin') {
        this.users = await this.userService.getAllUsers();
      }

      this.applyFilters();
    } catch (error) {
      console.error('Błąd przy inicjalizacji:', error);
      this.snackBar.open('❌ Nie udało się załadować danych', 'Zamknij', {
        duration: 4000
      });
    }
  }

  async deleteTask(task: Task) {
    try {
      await this.taskService.deleteTask(task.id!);
      this.snackBar.open('🗑 Zadanie usunięte!', 'Zamknij', { duration: 3000 });
      this.allTasks = this.allTasks.filter(t => t.id !== task.id);
      this.applyFilters();
    } catch (error) {
      console.error('Błąd przy usuwaniu:', error);
      this.snackBar.open('❌ Nie udało się usunąć zadania', 'Zamknij', { duration: 4000 });
    }
  }

  async markAsDone(task: Task) {
    try {
      const updatedTask: Partial<Task> = {
        ...task,
        status: 'done',
        completedAt: new Date(),
        updatedAt: new Date()
      };

      await this.taskService.updateTask(task.id!, updatedTask);
      this.snackBar.open('✅ Zadanie oznaczone jako ukończone!', 'Zamknij', { duration: 3000 });
      const index = this.allTasks.findIndex(t => t.id === task.id);
      if (index > -1) this.allTasks[index] = { ...this.allTasks[index], ...updatedTask } as Task;
      this.applyFilters();
    } catch (error) {
      console.error('Błąd przy aktualizacji:', error);
      this.snackBar.open('❌ Nie udało się zaktualizować zadania', 'Zamknij', { duration: 4000 });
    }
  }

  applyFilters(): void {
    let filtered = [...this.allTasks];

    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === this.filterStatus);
    }

    if (this.userRole === 'admin' && this.filterUser !== 'all') {
      filtered = filtered.filter(task => task.ownerId === this.filterUser);
    } else if (this.userRole !== 'admin') {
      filtered = filtered.filter(task => task.ownerId === this.currentUserId);
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
}
