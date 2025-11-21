FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose the port
EXPOSE 8001

# Start the application
CMD ["uvicorn", "main_with_ai_and_alerts:app", "--host", "0.0.0.0", "--port", "8001"]
