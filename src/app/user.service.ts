import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, getDocs, doc, getDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  async getCurrentUserData() {
    const user = this.auth.currentUser;
    if (!user) return null;
    const userDocRef = doc(this.firestore, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      return null;
    }
  }

  // NOWA METODA: Pobierz wszystkich użytkowników
  async getAllUsers() {
    const usersCol = collection(this.firestore, 'users');
    const usersSnap = await getDocs(usersCol);
    return usersSnap.docs.map(doc => doc.data());
  }
}
