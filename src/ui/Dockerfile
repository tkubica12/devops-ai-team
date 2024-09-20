# Stage 1: Build the React frontend
FROM node:18 AS frontend-build

WORKDIR /app

# Copy the frontend source code
COPY /frontend/package.json /frontend/package-lock.json ./
RUN npm install

COPY /frontend ./
RUN npm run build

# Stage 2: Build the Python backend and serve the frontend
FROM python:3.12-slim

WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend source code
COPY main.py .
COPY Event.py .

# Copy the frontend build artifacts
COPY --from=frontend-build /app/build ./ui

# Expose the port the app runs on
EXPOSE 8000

# Command to run the backend
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]