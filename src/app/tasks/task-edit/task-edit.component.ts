import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../task.service';
import { Task } from '../../models/task.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, FormsModule,  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule],

  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {
  taskId!: string;
  task: Task | null = null;


  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router,
      private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.taskService.getTaskById(id).then(task => {
      this.task = task;
    }).catch(err => {
      console.error('Błąd podczas ładowania zadania', err);
      this.snackBar.open('❌ Nie udało się załadować zadania.', 'Zamknij', {
        duration: 4000
      });
    });
  }
}

async saveTask() {
  if (!this.task || !this.task.title || !this.task.priority || !this.task.status) {
    this.snackBar.open('⚠️ Uzupełnij wymagane pola!', 'Zamknij', { duration: 3000 });
    return;
  }

  try {
    this.task.updatedAt = new Date();
    await this.taskService.updateTask(this.task.id!, this.task);

    this.snackBar.open('✅ Zmiany zapisane!', 'Zamknij', { duration: 3000 });
    this.router.navigate(['/tasks']);
  } catch (error) {
    console.error('Błąd przy zapisie zadania:', error);
    this.snackBar.open('❌ Nie udało się zapisać zadania.', 'Zamknij', { duration: 4000 });
  }
}
}