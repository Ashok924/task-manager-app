# Simple Personal Task Manager App

## Project Goal
Build a clean and modern task manager application with task creation, completion toggle, deletion, filtering, and local persistence.

## Tech Stack
- Next.js 15 + TypeScript
- Tailwind v4 (not v3)
- Client Components for interaction
- Local storage for persistence
- Light/Modern UI

## Quick Rules
- Use TypeScript interfaces for all data types
- Use Client Components for forms & interactive sections
- Use Server Components for display-only sections if needed
- Use arrow functions, export default at bottom
- Keep UI simple, clean, consistent
- State stored inside client components + synced with LocalStorage
- After implementing each feature, ask user to test

## Core Data Type

```ts
interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}
```

## Core Features

### 1. Add Task
- Input box + Add button
- Validate empty input
- Save to LocalStorage

### 2. Toggle Complete
- Checkbox or toggle
- Update LocalStorage

### 3. Delete Task
- Delete button
- Smooth fade-out animation

### 4. Filters
- All, Active, Completed

### 5. Local Persistence
- Save tasks to LocalStorage on change
- Load tasks on first render

### 6. Responsive UI
- Clean layout
- Mobile-first

## Suggested Folder Structure

```
/app
  /components
    TaskForm.tsx
    TaskList.tsx
    TaskItem.tsx
  /hooks
    useTasks.ts
  /types
    task.ts
  page.tsx
```

## Optional Enhancements
- Dark mode
- Drag & drop reordering
- Task categories
- External DB sync

## Development Workflow
1. Implement Task interface
2. UI skeleton
3. Add-task functionality
4. Toggle complete
5. Delete
6. Filters
7. LocalStorage
8. Tailwind styling
9. Final cleanup
