# Deployment Strategy

## Purpose

This document defines the deployment strategy for the Textile Marketplace prototype.

The deployment process should prioritize:

* Simplicity
* Fast deployments
* Minimal operational overhead
* Production-like environment
* Easy scalability in the future

The deployment architecture should be sufficient for the hackathon while remaining easy to evolve into a production system.

---

# Deployment Architecture

```
                    Internet
                        │
        ┌────────────────────────────────┐
        │                                │
        ▼                                ▼
 Frontend (Vercel)                Backend (Railway)
        │                                │
        └──────────────┬─────────────────┘
                       │
                PostgreSQL (Neon)
```

---

# Frontend Deployment

## Platform

Vercel

### Responsibilities

* Host React application
* Global CDN
* Static asset hosting
* Automatic deployments
* HTTPS
* Environment variable management

### Build Command

```bash
pnpm build
```

### Output Directory

```text
dist
```

### Environment Variables

```env
VITE_API_BASE_URL=
```

---

# Backend Deployment

## Platform

Railway

### Responsibilities

* Host FastAPI application
* Serve REST APIs
* Authentication
* AI APIs
* Business logic
* Database communication

### Runtime

Python 3.13+

### Start Command

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Environment Variables

```env
APP_ENV=production

DATABASE_URL=

JWT_SECRET_KEY=

JWT_ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30

HF_API_KEY=

FRONTEND_URL=
```

---

# Database Deployment

## Platform

Neon PostgreSQL

### Responsibilities

* User data
* Products
* Inventory
* Orders
* Cart
* AI metadata

### Connection

Backend communicates with Neon using a secure PostgreSQL connection string.

---

# Static Assets

During the prototype phase:

* Product images stored locally within the backend.

Future production upgrade:

* Amazon S3
* Cloudinary

---

# Environment Configuration

Each deployment environment should maintain its own configuration.

## Development

```text
.env
```

## Production

Managed using platform environment variables.

Secrets must never be committed to Git.

---

# HTTPS

All production traffic should use HTTPS.

Provided by:

* Vercel
* Railway

---

# CORS

Backend should only allow requests from approved frontend origins.

Example:

```text
Development

http://localhost:5173

Production

https://your-domain.com
```

---

# API Communication

Frontend communicates only with the backend REST API.

```
React Application
        │
        ▼
FastAPI REST API
        │
        ▼
PostgreSQL
```

Direct database access from the frontend is never permitted.

---

# Authentication

Authentication uses JWT.

Workflow:

```
Login

↓

Backend validates credentials

↓

JWT issued

↓

Frontend stores token

↓

Authenticated API requests
```

---

# CI/CD

## Source Control

GitHub

### Frontend

Every push to the main branch triggers:

* Install dependencies
* Build application
* Deploy to Vercel

### Backend

Every push to the main branch triggers:

* Install dependencies
* Start deployment on Railway

---

# Deployment Environments

## Local Development

Frontend

```text
http://localhost:5173
```

Backend

```text
http://localhost:8000
```

API Documentation

```text
http://localhost:8000/docs
```

---

## Production

Frontend

```text
https://<frontend-domain>
```

Backend

```text
https://<backend-domain>
```

API Documentation

```text
https://<backend-domain>/docs
```

---

# Health Check

The backend should expose a lightweight endpoint.

```
GET /health
```

Response

```json
{
  "status": "healthy"
}
```

This endpoint can be used by deployment platforms to verify application availability.

---

# Logging

Application logs should include:

* Startup events
* API errors
* Authentication failures
* Unexpected exceptions

Sensitive information such as passwords, tokens, or secrets must never be logged.

---

# Database Migrations

Schema changes should be managed using Alembic.

Deployment process:

```
Deploy Backend

↓

Run Database Migrations

↓

Start Application
```

This ensures the database schema remains synchronized with the application.

---

# Backup Strategy

Prototype:

* Managed by Neon.

Future production:

* Scheduled automated backups.
* Point-in-time recovery.
* Disaster recovery procedures.

---

# Future Production Enhancements

The deployment architecture should support future upgrades without requiring major structural changes.

Potential enhancements include:

* Docker containers
* GitHub Actions CI/CD pipelines
* Redis for caching
* Background workers
* Object storage (Amazon S3 or Cloudinary)
* CDN optimization
* Custom domain
* Monitoring and alerting
* OpenTelemetry
* Horizontal scaling
* Load balancing
* Reverse proxy
* Kubernetes deployment (if required)
