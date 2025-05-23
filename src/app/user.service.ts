import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, getDocs, doc, getDoc } from '@angular/fire/firestore';
import { User } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore, private auth: Auth) {}

   async getCurrentUserData(): Promise<User | null> {
    const user = this.auth.currentUser;
    if (!user) return null;
    const userDocRef = doc(this.firestore, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      return userSnap.data() as User; 
    } else {
      return null;
    }
  }


  async getAllUsers(): Promise<User[]> {
  const usersCol = collection(this.firestore, 'users');
  const snapshot = await getDocs(usersCol);

  return snapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data()
  } as User));
}
}
