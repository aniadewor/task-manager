import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
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
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(private auth: Auth, private router: Router,  private snackBar: MatSnackBar) {}

 async onSubmit() {
  try {
    console.log('Próba logowania z:', this.email, this.password);
    const res = await signInWithEmailAndPassword(this.auth, this.email, this.password);

    this.snackBar.open('✅ Zalogowano pomyślnie!', 'Zamknij', {
      duration: 3000
    });

    this.router.navigate(['/dashboard']);
  } catch (error: any) {
    this.error = this.getErrorMessage(error.code);

    this.snackBar.open('❌ Błąd logowania: ' + this.error, 'Zamknij', {
      duration: 5000
    });
  }
}

getErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Nieprawidłowy email lub hasło!';
    case 'auth/invalid-email':
      return 'Nieprawidłowy format email!';
    default:
      return 'Coś poszło nie tak. Spróbuj ponownie.';
  }
}
}
