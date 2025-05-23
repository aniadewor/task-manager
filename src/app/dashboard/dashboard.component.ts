import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TaskListComponent } from '../tasks/task-list/task-list.component';
import { TaskAddComponent } from '../tasks/task-add/task-add.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    TaskListComponent,
    TaskAddComponent
  ]
})
export class DashboardComponent implements OnInit {
  userData: any;
  currentView: 'list' | 'add' = 'list';

  constructor(private userService: UserService) {}

  async ngOnInit() {
    this.userData = await this.userService.getCurrentUserData();
    console.log('Pobrane userData:', this.userData);
  }

  setView(view: 'list' | 'add') {
    this.currentView = view;
  }
}
