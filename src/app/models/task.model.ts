export interface Task {
  id?: string; // generowane przez Firestore
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  assignedUser?: string; // uid użytkownika (opcjonalne)
  attachments?: string[];
  completedAt?: Date | null;
  ownerId: string; // uid właściciela zadania
}
