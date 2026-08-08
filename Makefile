.PHONY: help install dev-frontend dev-backend db-up db-down migrate seed build-frontend build-backend push-backend clean

# Default target
help:
	@echo "Available commands:"
	@echo "  make install        - Install dependencies for both frontend and backend"
	@echo "  make dev-frontend   - Start the Vite development server for the frontend"
	@echo "  make dev-backend    - Start the Uvicorn development server for the backend"
	@echo "  make db-up          - Start the PostgreSQL database using Docker Compose"
	@echo "  make db-down        - Stop the PostgreSQL database"
	@echo "  make migrate        - Run Alembic database migrations (backend)"
	@echo "  make seed           - Seed the database with initial data (backend)"
	@echo "  make build-frontend - Build the frontend for production"
	@echo "  make build-backend  - Build the backend Docker image"
	@echo "  make push-backend   - Push the backend Docker image to Docker Hub"
	@echo "  make run-backend-docker - Run the backend Docker image locally on port 8080"
	@echo "  make clean          - Remove dependencies, environments, and build artifacts"

# --- Setup ---
install:
	@echo "Installing backend dependencies (uv)..."
	cd backend && uv sync
	@echo "Installing frontend dependencies (pnpm)..."
	cd frontend && pnpm install

# --- Development ---
dev-frontend:
	@echo "Starting frontend dev server..."
	cd frontend && pnpm run dev

dev-backend:
	@echo "Starting backend dev server..."
	cd backend && uv run uvicorn app.main:app --reload --port 8080

# --- Database ---
db-up:
	@echo "Starting database container..."
	docker-compose up -d

db-down:
	@echo "Stopping database container..."
	docker-compose down

migrate:
	@echo "Running database migrations..."
	cd backend && uv run alembic upgrade head

seed:
	@echo "Seeding the database..."
	cd backend && uv run python seed.py

# --- Build ---
build-frontend:
	@echo "Building frontend..."
	cd frontend && pnpm run build

docker-image: build-backend push-backend

build-backend:
	@echo "Building backend Docker image..."
	cd backend && docker build -t unbeatablebann/texora-b2b-marketplace:latest .

run-backend-docker:
	@echo "Running backend Docker image locally on port 8080..."
	docker run -p 8080:8080 -e PORT=8080 unbeatablebann/texora-b2b-marketplace:latest

push-backend:
	@echo "Pushing backend Docker image..."
	docker push unbeatablebann/texora-b2b-marketplace:latest

# --- Cleanup ---
clean:
	@echo "Cleaning up environments and caches..."
	rm -rf frontend/node_modules frontend/dist
	rm -rf backend/.venv backend/__pycache__
