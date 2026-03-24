# Running BragBoard Locally (Without Docker)

You can run the FastAPI server directly on your host machine for faster development and debugging, while keeping the PostgreSQL database running in Docker.

## Prerequisites

1.  **Database**: The database must be running in Docker:
    ```bash
    docker compose up -d db
    ```
2.  **Env File**: Ensure your `.env` file has `POSTGRES_HOST=localhost`. (I have already updated this for you).

## Steps to Run

### 1. Create a Virtual Environment (Recommended)

From the project root:
```powershell
cd server
python -m venv venv
.\venv\Scripts\activate
```

### 2. Install Dependencies

```powershell
pip install -r requirements.txt
```

### 3. Run the Server

```powershell
uvicorn main:app --reload
```

The server will be available at `http://localhost:8000`.
You can access the API documentation at `http://localhost:8000/docs`.

---

> [!NOTE]
> The `--reload` flag enables auto-restart whenever you change the code.
