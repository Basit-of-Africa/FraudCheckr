# Quick Start Guide

Get the EFCC Convictions Explorer up and running in minutes!

## Prerequisites

Before you start, make sure you have:

- **Python 3.10+** - For the backend
- **Node.js 16+** - For the frontend
- **Git** - For version control
- **pip & npm** - Package managers (included with Python and Node.js)

## 5-Minute Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/efcc-convictions-explorer.git
cd efcc-convictions-explorer
```

### Step 2: Start the Backend API

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the API server
python main.py
# Or use Uvicorn directly:
# uvicorn main:app --reload
```

**Expected output:**
```
[LOAD] SUCCESS: Loaded 7876 conviction records from data/convictions.csv
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Step 3: Start the Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

**Expected output:**
```
  VITE v5.4.21  ready in 656 ms

  ➜  Local:   http://localhost:3000/
```

### Step 4: Access the Application

- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **API Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **API ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## What's Next?

- [Explore the API](../api/overview.md) - Learn about available endpoints
- [Frontend Guide](../frontend/overview.md) - Understand the dashboard
- [Data Schema](../architecture/data-schema.md) - Understand the data structure

## Troubleshooting

### Port Already in Use

If port 8000 or 3000 is already in use:

**Backend:**
```bash
uvicorn main:app --port 8001
```

**Frontend:**
```bash
npm run dev -- --port 3001
```

### Module Not Found

Make sure all dependencies are installed:

```bash
# For backend
pip install -r requirements.txt

# For frontend
cd frontend && npm install
```

### API Connection Error

Ensure the backend is running on port 8000 before starting the frontend.

## Running Tests

To run the API test suite:

```bash
python test_api.py
```

This will:
1. Start the API server
2. Run 7 comprehensive tests
3. Display test results
4. Stop the server

---

**Next:** [Installation Guide](installation.md)
