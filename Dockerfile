# filepath: /Users/abhinavjain/Zephyra/zephyra_backend/Dockerfile
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project
COPY . /app/

# Copy SSL certificates
COPY cert.pem /app/cert.pem
COPY key.pem /app/key.pem

# Expose port
EXPOSE 8000

# Run the application with HTTPS
CMD ["python", "manage.py", "runserver_plus", "--cert-file", "cert.pem", "--key-file", "key.pem", "0.0.0.0:8000"]