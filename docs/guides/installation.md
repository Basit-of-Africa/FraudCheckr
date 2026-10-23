# Installation Guide

Detailed installation instructions for the EFCC Convictions Explorer.

## System Requirements

### Backend Requirements
- Python 3.10 or higher
- pip (Python package manager)
- Virtual environment support

### Frontend Requirements
- Node.js 16.0 or higher
- npm or yarn

### Development Requirements
- Git for version control
- GitHub account (for pushing code)
- Text editor or IDE (VS Code recommended)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/efcc-convictions-explorer.git
cd efcc-convictions-explorer
```

### 2. Backend Setup

#### Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

#### Install Dependencies

```bash
# Upgrade pip (optional but recommended)
pip install --upgrade pip

# Install project dependencies
pip install -r requirements.txt
```

**What gets installed:**
- fastapi==0.104.1
- uvicorn==0.24.0
- pandas>=2.1.0
- pydantic>=2.0
- python-multipart==0.0.6

#### Verify Installation

```bash
python -c "import fastapi; print(f'FastAPI {fastapi.__version__}')"
python -c "import pandas; print(f'Pandas {pandas.__version__}')"
```

### 3. Frontend Setup

#### Navigate to Frontend Directory

```bash
cd frontend
```

#### Install Dependencies

```bash
npm install
```

**What gets installed:**
- react@18.2.0
- react-dom@18.2.0
- axios@1.6.0
- lucide-react@0.263.1
- vite@5.0.0
- tailwindcss@3.3.0

#### Verify Installation

```bash
npm list react vite
```

### 4. Data Setup

The platform includes sample data:

```
data/convictions.csv        # canonical dataset (built by scripts/build_dataset.py)
data/source/                # EFCC source tables (2020 to 2024)
```

To rebuild the dataset after changing the EFCC source tables in `data/source/`:

```bash
python scripts/build_dataset.py
```

## Post-Installation

### Run Test Suite

```bash
python test_api.py
```

Expected output: All 7 tests pass ✅

### Start Development Servers

**Terminal 1 - Backend:**
```bash
# Make sure virtual environment is activated
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the Application

- Frontend: [http://localhost:3000](http://localhost:3000)
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Troubleshooting

### Python Version Issue

```bash
# Check Python version
python --version

# If Python 3.10+ not available, use python3
python3 --version
python3 -m venv venv
```

### Virtual Environment Not Activating

```bash
# Windows PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then activate
venv\Scripts\Activate.ps1
```

### npm Install Failures

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -r node_modules package-lock.json

# Reinstall
npm install
```

### Port Already in Use

```bash
# Backend on different port
uvicorn main:app --port 8001

# Frontend on different port
npm run dev -- --port 3001
```

## Next Steps

- [Configuration Guide](configuration.md)
- [Quick Start](getting-started.md)
- [API Overview](../api/overview.md)

---

**Need Help?** Check the [Troubleshooting](../troubleshooting.md) guide or [FAQ](../faq.md).
