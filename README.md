# NagaEd — Software Developer Hurdle Task Submission

## Author

- **Name:** Dipendu Kumbhakar
- **Email:** kumardipendu1@gmail.com
- **Phone:** 8252634863

## Overview

This project is a full-stack user registration and authentication system built for the NagaEd Software Developer Hurdle Task. It consists of four services:

1. **Backend** — Node.js (Express) REST API handling registration, login, and protected user data, backed by MySQL.
2. **Frontend** — React (Vite) app with Register, Login, and Dashboard pages.
3. **AI Service** — Python FastAPI microservice that suggests usernames using the Groq LLM API.
4. **Database** — MySQL, auto-initialized via a Docker-mounted SQL script.

All four run together via Docker Compose.

## Architecture

See `architecture-diagram.png` in the repository root for a visual overview of how the services communicate.

In short:
- The **browser** talks to the **frontend** (Nginx-served React build) on port 80.
- The frontend calls the **backend** (port 5000) for auth/user data, and calls the **AI service** (port 8000) directly for username suggestions.
- The **backend** talks to **MySQL** (internal network) for all user data.
- The **AI service** calls the external **Groq API** to generate username suggestions.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, bcrypt, jsonwebtoken, mysql2
- **AI Service:** FastAPI, Pydantic, Groq SDK
- **Database:** MySQL 8.0
- **Containerization:** Docker, Docker Compose

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- A free [Groq API key](https://console.groq.com) (no credit card required)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd nagaed-task
```

### 2. Configure environment variables

Copy the example env file and fill in your own values:

```bash
cp .env.example .env
```

Edit `.env` with real values:

```
DB_ROOT_PASSWORD=your_chosen_root_password
DB_USER=nagaed_user
DB_PASSWORD=your_chosen_password
DB_NAME=nagaed_db
JWT_SECRET=a_long_random_string
GROQ_API_KEY=your_real_groq_api_key
```

> **Note:** Get a free Groq API key at [console.groq.com](https://console.groq.com) — sign up, go to API Keys, and create a new key. No credit card required.

### 3. Start all services

```bash
docker compose up --build
```

This builds and starts four containers: `mysql`, `backend`, `ai-service`, and `frontend`. On first run, MySQL will automatically create the `users` table via `mysql-init/init.sql`.

### 4. Access the application

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:5000 |
| AI Service (Swagger docs) | http://localhost:8000/docs |

### 5. Try it out

1. Go to `http://localhost`
2. On the Register page, optionally type some interests (e.g. `gaming, hiking`) and click **"✨ Suggest a username"** to get AI-generated suggestions from the Groq-powered microservice
3. Complete registration
4. Log in
5. View your Dashboard — it will show your own account's username, email, and address

## Resetting the database

If you need a completely fresh database (e.g. to re-run the init script):

```bash
docker compose down -v
docker compose up --build
```

The `-v` flag removes the MySQL volume, so `init.sql` runs again on next startup.

## API Endpoints

### Backend (Node.js) — `http://localhost:5000`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/register` | No | Register a new user |
| POST | `/api/login` | No | Log in, returns a JWT |
| GET | `/api/users/me` | Yes (Bearer token) | Get the logged-in user's own data |
| GET | `/api/users/:id` | Yes (Bearer token) | Get a specific user's data by ID |

### AI Service (FastAPI) — `http://localhost:8000`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/suggest-username` | Accepts `{ interests: string[] }`, returns `{ suggestions: string[] }` |

Full interactive documentation available at `http://localhost:8000/docs`.

## Security Notes

- Passwords are hashed with bcrypt before storage — never stored in plain text.
- JWTs are used for authentication, signed with a secret loaded from environment variables.
- The Groq API key is loaded from an environment variable, never hardcoded.
- Docker containers run as non-root users.
- Secrets are excluded from version control via `.gitignore` and `.dockerignore`.

## Project Structure

```
nagaed-task/
├── docker-compose.yml
├── .env.example
├── architecture-diagram.png
├── ai-service/
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
├── backend/
│   ├── Dockerfile
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── frontend/
│   ├── Dockerfile
│   └── src/
└── mysql-init/
    └── init.sql
```
