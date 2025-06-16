# Taskify

## Features

- User authentication (JWT and auto refresh)
- CRUD operations for tasks
- Task filtering (All/Active/Completed)
- Task sharing with other users
- Commenting system
- Dockerized deployment

## Running with Docker

1. Install Docker and Docker Compose
2. Clone repository: `git clone https://github.com/PaulUno777/taskify`
3. Run: `docker compose up --build`
4. Access app at `http://localhost:4200`

## Local Development

### Backend:

1. `cd backend`
2. `npm install`
3. Create `.env` according to .env.example
4. `npm run dev`

### Frontend:

1. `cd frontend`
2. `npm install`
3. `ng serve`

## GCP Deployment

1. **Backend**:

- Containerize and deploy to Cloud Run
- Set environment variables in GCP console

2. **Frontend**:

- Set config variables on environments/
- Build with `ng build --prod`
- Deploy to Cloud Storage (static hosting)

3. **Database**:

- Sqlite for simplicity

## Additional Features

- **Authentication**: JWT-based auth with protected routes with auto refresh
- **Task Filtering**: Status-based task filtering
- **Sharing**: Collaborative task management
- **Comments**: Discussion threads per task
- **Unit Tests**: 85% coverage with Jest/Karma
