
# **Factory.io**

## **Overview**
Factory.io is a web application consisting of:
- A **Flask** backend with:
  - **Flask-Restx** for API management.
  - **JWT** for authentication.
  - **PostgreSQL** as the database.
- A **React** frontend:
  - Built with React.
  - Served via Flask in production.

---

## **Prerequisites**
Ensure the following are installed on your system:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (required for building the frontend locally)

---

## **Project Structure**

```
project/
├── server/             # Backend Flask application
│   ├── __init__.py     # Flask app factory
│   ├── app.py          # Main entry point
│   ├── models/         # SQLAlchemy models
│   ├── routes/         # API routes
│   ├── extensions.py   # Extensions (db, jwt, etc.)
│   ├── config.py       # Configuration file
│   │── migrations/     # Alembic migration scripts
│   │── Dockerfile      # Docker configuration for backend
│   └── requirements.txt# Python dependencies
├── frontend/           # React frontend application
│   ├── public/         # Static files
│   ├── src/            # React source files
│   │── package.json    # Frontend dependencies
│   └── Dockerfile      # Docker configuration for backend
└── docker-compose.yml  # Docker Compose configuration

```

---

## **Getting Started**

### **Clone the Repository**
```bash
git clone <repository-url>
cd project
```

---

## **Build the Frontend**
If you need to build the React frontend locally:

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the React app for production:
   ```bash
   npm run build
   ```

The production build will be available in the `frontend/build` directory. This will be consumed by Docker during the build process.

---

## **Run the Application with Docker**
1. Build the Docker images and start the containers:
   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - **Backend (API):** [http://localhost:8000](http://localhost:8000)
   - **Swagger UI:** [http://localhost:8000/swagger](http://localhost:8000/swagger)
   - **Frontend:** [http://localhost:8000/home](http://localhost:8000/home) (served by Flask)

---

## **Database Migrations**
1. Access the server container:
   ```bash
   docker-compose exec server bash
   ```

2. Initialize the migrations folder (only required once):
   ```bash
   flask db init
   ```

3. Generate a new migration script:
   ```bash
   flask db migrate -m "Initial migration"
   ```

4. Apply the migrations to the database:
   ```bash
   flask db upgrade
   ```

---

## **Watch for Backend Changes**
The project uses **Watchdog** to monitor changes in backend files. During development, any changes to `.py` files in the server directory will automatically restart the server.

---

## **Environment Variables**
The project uses the following environment variables, defined in `docker-compose.yml`:

| Variable             | Description               | Default Value         |
|----------------------|---------------------------|-----------------------|
| `POSTGRES_HOST`      | PostgreSQL host           | `db`                 |
| `POSTGRES_PORT`      | PostgreSQL port           | `5432`               |
| `POSTGRES_DB`        | PostgreSQL database name  | `mydatabase`         |
| `POSTGRES_USER`      | PostgreSQL username       | `postgres`           |
| `POSTGRES_PASSWORD`  | PostgreSQL password       | `mypassword`         |
| `FLASK_ENV`          | Flask environment         | `development`        |
| `FLASK_APP`          | Flask app entry point     | `app.py`             |
| `JWT_SECRET_KEY`     | JWT secret key            | `your_jwt_secret_key`|

---

## **Additional Commands**

### **Stop Containers**
To stop the running containers:
```bash
docker-compose down
```

---

### **Rebuild the Containers**
If you’ve made changes to the `Dockerfile` or `docker-compose.yml`, rebuild the containers:
```bash
docker-compose up --build
```

---

### **Reset the Database**
To completely reset the database, delete the volume:
```bash
docker-compose down --volumes
docker-compose up --build
```

---

### **Frontend Development (Optional)**
For local frontend development without Docker:

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Start the React development server:
   ```bash
   npm start
   ```

3. Access the frontend at:
   [http://localhost:1234](http://localhost:1234)

---

## **License**
Include your project's license information here (if applicable).

---

