# NexaFlow - React + Node.js + MongoDB

## Architecture

React + Vite
        ↓
Node.js + Express
        ↓
MongoDB

All major modules use the backend API. Tasks, messages, documents, notifications, team members and settings are stored in MongoDB.

## 1. Start MongoDB

### Local MongoDB
Use:
mongodb://127.0.0.1:27017/nexaflow

### MongoDB Atlas
Set MONGODB_URI in `backend/.env` to your Atlas connection string.

## 2. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Windows PowerShell alternative:

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run dev
```

Optional demo data:

```bash
npm run seed
```

## 3. Frontend

Open another terminal:

```bash
npm install
npm run dev
```

Frontend:
http://localhost:5173

Backend:
http://localhost:5000

Health check:
http://localhost:5000/api/health

## MongoDB collections

- tasks
- messages
- documents
- notifications
- teammembers
- settings

Documents are stored as binary data in MongoDB for this demo. The backend limits each uploaded file to 10 MB.

## Important

Do not commit `backend/.env` to GitHub. Use `.env.example` as the template.
