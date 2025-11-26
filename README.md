# Task Manager App (Coordinator)

This folder coordinates starting the `nodejs-mysql-backend` and `frontend` projects together.

How it works
- It uses `concurrently` to run the two npm scripts in parallel.
- It relies on the existing `nodejs-mysql-backend` and `frontend` folders located at the same level as this folder.

Quick start (PowerShell)

1. Open a terminal at the repository root `d:\Projects\react\react-nextjs-cursor-ai`.
2. Install the coordinator dependency:

```powershell
cd task-manager-app
npm install
```

3. From the same folder, run both apps:

```powershell
npm run dev
```

Notes and troubleshooting
- The backend requires a running MySQL server and correct credentials in `nodejs-mysql-backend/.env`.
- If you don't have MySQL installed on Windows, install it and ensure `mysql.exe` is on your PATH.
- You can run the DB setup separately before starting the apps:

```powershell
cd nodejs-mysql-backend
npm install
node setup.js
```

- To run backend and frontend independently:
  - Backend: `cd nodejs-mysql-backend; npm install; npm run dev`
  - Frontend: `cd frontend; npm install; npm run dev`

If you want me to physically move the `nodejs-mysql-backend` and `frontend` folders inside `task-manager-app` (instead of coordinating from here), tell me and I'll move them and update paths accordingly.
