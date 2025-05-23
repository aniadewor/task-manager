import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private auth: Auth,
    private router: Router,
    private firestore: Firestore
  ) {}

  async onSubmit() {
    try {
      const cred: UserCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );

      // Zapisz dane użytkownika do Firestore
      await setDoc(doc(this.firestore, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        role: 'user', // domyślnie user, admina ustawisz ręcznie
        createdAt: new Date()
      });

      this.router.navigate(['/login']);
    } catch (error: any) {
      this.error = this.getErrorMessage(error.code);
    }
  }

  getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'Taki email już istnieje!';
      case 'auth/invalid-email':
        return 'Nieprawidłowy email!';
      case 'auth/weak-password':
        return 'Hasło musi mieć co najmniej 6 znaków!';
      default:
        return 'Coś poszło nie tak, spróbuj ponownie!';
    }
  }
}
