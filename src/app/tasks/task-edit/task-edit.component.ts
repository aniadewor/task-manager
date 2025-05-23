import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {
  taskId!: string;
  task: Task | null = null;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id')!;
    const allTasks = await this.taskService.getAllTasks(); // możesz też stworzyć metodę getTaskById()
    this.task = allTasks.find(task => task.id === this.taskId) || null;

    if (!this.task) {
      alert('Nie znaleziono zadania.');
      this.router.navigate(['/tasks']);
    }
  }

  async saveTask() {
    if (this.task) {
      await this.taskService.updateTask(this.taskId, this.task);
      this.router.navigate(['/tasks']);
    }
  }
}
