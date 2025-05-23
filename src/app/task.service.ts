import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, getDoc, collectionData, query, where, getDocs } from '@angular/fire/firestore';
import { Task } from './models/task.model';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  // Dodaj nowe zadanie
  async addTask(task: Task) {
    task.ownerId = this.getCurrentUserId()!;
    task.createdAt = new Date();
    task.updatedAt = new Date();
    const tasksCol = collection(this.firestore, 'tasks');
    await addDoc(tasksCol, task);
  }

  // Aktualizuj istniejące zadanie
  async updateTask(taskId: string, task: Partial<Task>) {
    task.updatedAt = new Date();
    const taskDocRef = doc(this.firestore, 'tasks', taskId);
    await updateDoc(taskDocRef, task);
  }

  // Usuń zadanie
  async deleteTask(taskId: string) {
    const taskDocRef = doc(this.firestore, 'tasks', taskId);
    await deleteDoc(taskDocRef);
  }

  // Pobierz wszystkie zadania (dla admina)
  async getAllTasks(): Promise<Task[]> {
    const tasksCol = collection(this.firestore, 'tasks');
    const taskSnapshot = await getDocs(tasksCol);
    return taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
  }

  // Pobierz zadania tylko zalogowanego użytkownika
  async getTasksByOwner(): Promise<Task[]> {
    const uid = this.getCurrentUserId();
    const tasksCol = collection(this.firestore, 'tasks');
    const q = query(tasksCol, where('ownerId', '==', uid));
    const taskSnapshot = await getDocs(q);
    return taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
  }
  // Pobierz pojedyncze zadanie po ID
async getTaskById(taskId: string): Promise<Task | null> {
  const taskDocRef = doc(this.firestore, 'tasks', taskId);
  const taskSnap = await getDoc(taskDocRef);
  return taskSnap.exists() ? ({ id: taskSnap.id, ...taskSnap.data() } as Task) : null;
}
}
