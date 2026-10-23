# Configuration Guide

How to configure EFCC Convictions Explorer for different environments.

## Environment Variables

Create a `.env` file in the project root:

```bash
# Backend Configuration
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
BACKEND_RELOAD=True
BACKEND_WORKERS=1

# Database (future)
DATABASE_URL=sqlite:///convictions.db
DATABASE_POOL_SIZE=10

# Frontend Configuration
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=EFCC Convictions Explorer

# Security
CORS_ORIGINS=http://localhost:3000
DEBUG=True
```

## Backend Configuration

### Python Environment Variables

Edit `main.py` to use environment variables:

```python
import os
from dotenv import load_dotenv

load_dotenv()

HOST = os.getenv('BACKEND_HOST', '0.0.0.0')
PORT = int(os.getenv('BACKEND_PORT', 8000))
RELOAD = os.getenv('BACKEND_RELOAD', 'True') == 'True'
```

### API Server Options

#### Development Mode
```bash
python main.py
# or
uvicorn main:app --reload
```

#### Production Mode
```bash
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

#### Custom Configuration
```bash
uvicorn main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --workers 4 \
  --timeout 60
```

## Frontend Configuration

### Vite Configuration

Edit `frontend/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,           // Frontend port
    strictPort: false,     // Use next available port if busy
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',       // Build output directory
    minify: 'terser',     // Minification tool
    sourcemap: false      // Generate source maps
  }
})
```

### Environment Variables

Create `frontend/.env`:

```bash
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
VITE_ENVIRONMENT=development
```

Use in code:

```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

### Tailwind CSS Configuration

Edit `frontend/tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1f2937',
        secondary: '#3b82f6',
      },
      spacing: {
        // Add custom spacing
      }
    },
  },
  plugins: [],
}
```

## Data Configuration

### CSV File Location

The API loads `data/convictions.csv` (built by `scripts/build_dataset.py`). To load a different file, set the
`CONVICTIONS_CSV` environment variable. When `DATABASE_URL` is set, records are read from Neon instead.

### Rebuilding the dataset

```bash
python scripts/build_dataset.py          # rebuild data/convictions.csv
python scripts/build_dataset.py --check  # verify committed files match a fresh build
```

See `data/README.md` for the method and field definitions.

## CORS Configuration

### Enable CORS (for external clients)

Edit `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Restrict CORS to Specific Origins

```python
allow_origins=[
    "http://localhost:3000",
    "https://mydomain.com",
    "https://app.mydomain.com"
]
```

## Development vs Production

### Development Configuration

```python
# main.py
DEBUG = True
RELOAD = True
CORS_ORIGINS = ["*"]
LOG_LEVEL = "DEBUG"
```

### Production Configuration

```python
# main.py
DEBUG = False
RELOAD = False
CORS_ORIGINS = ["https://mydomain.com"]
LOG_LEVEL = "INFO"
```

## Logging Configuration

### Backend Logging

Add to `main.py`:

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
```

### Frontend Logging

In React:

```javascript
const isDevelopment = import.meta.env.DEV;

const log = (message, data = {}) => {
  if (isDevelopment) {
    console.log(`[${new Date().toISOString()}]`, message, data);
  }
}
```

## Docker Configuration

### Dockerfile (Backend)

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Dockerfile (Frontend)

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM caddy:2-alpine
COPY --from=build /app/dist /usr/share/caddy
```

## Environment-Specific Configuration

### Local Development

```bash
# .env.local
VITE_API_URL=http://localhost:8000
DEBUG=True
```

### Staging

```bash
# .env.staging
VITE_API_URL=https://staging-api.example.com
DEBUG=False
```

### Production

```bash
# .env.production
VITE_API_URL=https://api.example.com
DEBUG=False
RAILS_LOG_TO_STDOUT=true
```

## Configuration Best Practices

1. **Never commit secrets** (API keys, credentials, passwords)
2. **Use environment variables** for environment-specific config
3. **Document all configurations** with examples
4. **Use `.env.example`** as a template
5. **Validate configuration** at startup
6. **Log configuration** (but not secrets) at startup

---

**Related Documentation:**
- [Installation Guide](./installation.md)
- [Deployment Guide](./deployment.md)
- [Environment Variables](./environment.md)

**Documentation Version**: 1.0.0
