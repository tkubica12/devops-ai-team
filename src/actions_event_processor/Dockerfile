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