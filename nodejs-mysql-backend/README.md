# Task Manager Backend

Node.js/Express backend for the Task Manager app with MySQL database integration.

## Setup

### 1. Install Dependencies

```bash
cd nodejs-mysql-backend
npm install
```

### 2. Configure Database

Create a `.env` file in the `nodejs-mysql-backend` folder (copy from `.env.example`):

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_manager
JWT_SECRET=your-super-secret-key
PORT=5000
```

### 3. Create MySQL Database

Open MySQL and run:

```sql
CREATE DATABASE task_manager;
```

### 4. Start the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

The server will initialize database tables automatically on first run.

## API Endpoints

### Authentication

- **POST** `/api/auth/signup` - Register a new user
  ```json
  { "email": "user@example.com", "name": "John", "password": "pass123" }
  ```

- **POST** `/api/auth/login` - Login user
  ```json
  { "email": "user@example.com", "password": "pass123" }
  ```

### Tasks (Requires JWT Token)

- **GET** `/api/tasks` - Get all user tasks
- **POST** `/api/tasks` - Create new task
  ```json
  { "title": "Task title", "description": "Task description" }
  ```

- **PUT** `/api/tasks/:id` - Update task
  ```json
  { "title": "New title", "description": "New description", "completed": false }
  ```

- **DELETE** `/api/tasks/:id` - Delete task

- **PUT** `/api/tasks/:id/toggle` - Toggle task completion status

## Authentication

All task endpoints require an `Authorization` header with JWT token:

```
Authorization: Bearer <token>
```

Token is returned on login/signup.
