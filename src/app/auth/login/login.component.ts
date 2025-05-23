import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private auth: Auth, private router: Router) {}

  async onSubmit() {
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      // Po zalogowaniu przekieruj na stronę główną lub dashboard (do zmiany później)
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.error = this.getErrorMessage(error.code);
    }
  }

  getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
        return 'Nie ma takiego użytkownika!';
      case 'auth/wrong-password':
        return 'Błędne hasło!';
      case 'auth/invalid-email':
        return 'Nieprawidłowy email!';
      default:
        return 'Coś poszło nie tak, spróbuj ponownie!';
    }
  }
}
