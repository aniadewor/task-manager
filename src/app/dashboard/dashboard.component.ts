import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';    // <--- to jest kluczowe!
import { UserService } from '../user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule   // <--- dodaj to tutaj!
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userData: any;

  constructor(private userService: UserService) {}

  async ngOnInit() {
    this.userData = await this.userService.getCurrentUserData();
      this.userData = await this.userService.getCurrentUserData();
  console.log('Pobrane userData:', this.userData);
  }
}

