# Stage 1: Builder
FROM python:3.12-slim AS builder

# Copy uv from the official image
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Set working directory
WORKDIR /app

# Enable bytecode compilation for faster startup
ENV UV_COMPILE_BYTECODE=1

# Disable uv cache for smaller image
ENV UV_NO_CACHE=1

# Isolate the virtual environment to prevent host overwrite issues
ENV UV_PROJECT_ENVIRONMENT="/opt/venv"

# Copy only the dependency files first for layer caching
COPY pyproject.toml uv.lock ./

# Install dependencies in a virtual environment, explicitly using system python
RUN uv sync --frozen --no-install-project --no-dev --python /usr/local/bin/python

# Copy the rest of the application code
COPY . .

# Sync again to install the project itself (if needed)
RUN uv sync --frozen --no-dev --python /usr/local/bin/python

# Stage 2: Final runtime image
FROM python:3.12-slim

# Create a non-root user for security
RUN addgroup --system appgroup && adduser --system --group appuser

WORKDIR /app

# Copy the virtual environment from the builder stage
COPY --from=builder --chown=appuser:appgroup /opt/venv /opt/venv

# Copy the application code from the builder stage
COPY --from=builder --chown=appuser:appgroup /app /app

# Switch to the non-root user
USER appuser

# Ensure the virtual environment is in the PATH
ENV PATH="/opt/venv/bin:$PATH"

# Expose the port the app runs on (documentation only, dynamic port is used)
EXPOSE 8080

# Command to run the application
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}"]
