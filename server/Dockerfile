# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_ENV=development

# Set the working directory in the container
WORKDIR /app

RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY ./ ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install Watchdog and other tools
RUN pip install watchdog


# Expose port 8000 (or 5000, depending on your app config)
EXPOSE 8000

# Use Watchdog to monitor file changes
CMD ["watchmedo", "auto-restart", "--patterns=*.py;*.html", "--recursive", "--", "python", "app.py"]


