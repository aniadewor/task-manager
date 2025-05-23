# Task Manager

Aplikacja webowa stworzona w Angularze 19 z wykorzystaniem Firebase, służąca do zarządzania zadaniami. Umożliwia rejestrację, logowanie, zarządzanie własnymi zadaniami oraz – w przypadku konta administratora – przeglądanie i zarządzanie kontami użytkowników.

Projekt został zrealizowany przez Annę Dewor. Repozytorium znajduje się pod adresem:  
https://github.com/aniadewor/task-manager

## Funkcjonalności

- Rejestracja i logowanie użytkownika (Firebase Authentication)
- Obsługa ról: użytkownik (user) i administrator (admin)
- Dashboard z możliwością przełączania widoków (lista zadań, dodanie zadania, panel użytkowników)
- CRUD zadań – tworzenie, edycja, usuwanie, oznaczanie jako ukończone
- Filtrowanie zadań po statusie i sortowanie po dacie dodania lub priorytecie
- Panel administratora z listą zarejestrowanych użytkowników i możliwością ich usunięcia
- Obsługa błędów (try/catch) oraz komunikaty dla użytkownika z wykorzystaniem Angular Material (MatSnackBar)
- Responsywny interfejs oparty o Angular Material

## Technologie

- Angular 19 (Standalone Components, Routing)
- Firebase (Authentication, Firestore)
- Angular Material
- TypeScript
- SCSS

## Uruchomienie projektu

1. Sklonuj repozytorium:

git clone https://github.com/aniadewor/task-manager.git
cd task-manager


2. Zainstaluj zależności:

npm install


3. Skonfiguruj dane dostępowe do Firebase w pliku `src/environments/environment.ts`:

```ts
export const environment = {
  firebase: {
    apiKey: '...',
    authDomain: '...',
    projectId: '...',
    storageBucket: '...',
    messagingSenderId: '...',
    appId: '...'
  }
};
Uruchom projekt lokalnie:
ng serve
Aplikacja będzie dostępna pod adresem http://localhost:4200.
Struktura projektu

src/app/
├── auth/          - komponenty logowania i rejestracji
├── dashboard/     - główny widok użytkownika po zalogowaniu
├── tasks/         - komponenty związane z zadaniami
├── admin/         - komponent listy użytkowników dla admina
├── models/        - interfejsy danych (Task, User)
├── services/      - serwisy do obsługi Firebase i danych użytkownika
Konta testowe

Aby przetestować różne role, można założyć konta w Firebase Authentication i przypisać odpowiednią rolę (admin lub user) w kolekcji users w Firestore.

