# System Architecture

Overview of the EFCC Convictions Explorer system design and components.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    User Browser                              │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────┐        │
│  │      Frontend Application (React + Vite)        │        │
│  │                                                  │        │
│  │  Dashboard → Components → Axios API Client      │        │
│  └───────────────────────┬──────────────────────────┘        │
│                          │                                    │
│    HTTP/JSON            │HTTP REST Requests                  │
│                          ↓                                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ Port 3000 → Port 8000
                          │
┌─────────────────────────────────────────────────────────────┐
│                    Server/Backend                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────┐        │
│  │     FastAPI Application (Python + Uvicorn)      │        │
│  │                                                  │        │
│  │  REST Endpoints ↔ Data Processing ↔ Lifespan   │        │
│  └───────────────────────┬──────────────────────────┘        │
│                          │                                    │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────┐        │
│  │    Data Processing Layer (Pandas + Python)      │        │
│  │                                                  │        │
│  │  • Text cleaning and normalization              │        │
│  │  • Prison term parsing                          │        │
│  │  • Monetary value cleaning                      │        │
│  │  • Duplicate removal                            │        │
│  └───────────────────────┬──────────────────────────┘        │
│                          │                                    │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────┐        │
│  │         CSV Data Storage (Pandas)               │        │
│  │                                                  │        │
│  │  data/convictions.csv (canonical dataset)       │        │
│  └──────────────────────────────────────────────────┘        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Frontend Layer (React)

**Technologies:**
- React 18.2.0
- Vite 5.0.0
- Tailwind CSS 3.3.0
- Axios 1.6.0

**Key Components:**
- `Dashboard.jsx` - Main container managing state and orchestration
- `SearchBar.jsx` - User input for defendant search
- `DataTable.jsx` - Results display with pagination
- `StatsPanel.jsx` - Statistics visualization

**State Management:**
- React Hooks (useState, useEffect)
- Props for component communication

### 2. Backend Layer (FastAPI)

**Technologies:**
- FastAPI 0.104.1
- Uvicorn 0.24.0
- Python 3.10+

**Main Files:**
- `main.py` - API endpoints and server
- `models.py` - Pydantic data models
- `dataset.py` - Loads the canonical dataset; `scripts/build_dataset.py` builds it

**Endpoints:**
```
GET  /              - Health check
GET  /convictions   - Get all records
GET  /search        - Search by name
GET  /offense       - Filter by offense
GET  /court         - Filter by court
GET  /stats         - Get statistics
```

### 3. Data Processing Layer

**Tools:**
- Pandas for DataFrame operations
- Python regex for text processing

**Processes:**
1. CSV loading
2. Text normalization
3. Data cleaning
4. Prison term parsing
5. Monetary value extraction
6. Deduplication

### 4. Data Storage

**Current:**
- CSV file (in-memory Pandas DataFrame)
- Location: `data/convictions.csv`
- Size: about 7,900 records
- Format: name, offense, prison_term, fine, restitution, court

**Future:**
- SQL database (PostgreSQL recommended)
- Redis caching layer

## Data Flow

### Search/Filter Request Flow

```
User Input (Frontend)
        ↓
JavaScript Event Handler
        ↓
API Request (Axios)
        ↓
HTTP GET to /search endpoint
        ↓
FastAPI Route Handler
        ↓
Python List Comprehension (filter)
        ↓
Pydantic Validation
        ↓
JSON Response
        ↓
Frontend State Update
        ↓
Component Re-render
        ↓
User sees results
```

### Data Load Flow (Startup)

```
Application Start
        ↓
Uvicorn Initializes FastAPI
        ↓
Lifespan Context Manager Activates
        ↓
load_conviction_data() Function Executes
        ↓
CSV File Located & Opened
        ↓
Pandas reads CSV
        ↓
process_efcc_data() Transforms Data
        ↓
Global convictions_data Variable Set
        ↓
API Ready to Receive Requests
```

## Scalability Considerations

### Current Limitations

- **Memory-based**: All data in RAM (fine at this size)
- **Single-threaded**: No parallelization
- **No caching**: Every request processed fresh
- **No indexing**: Linear search through data

### Scaling Strategies

#### For 10,000+ records
- Migrate to SQL database (PostgreSQL)
- Add database indexes
- Implement query pagination more efficiently
- Add result caching with Redis

#### For 100,000+ records
- Implement full-text search (Elasticsearch)
- Sharding across multiple databases
- API rate limiting
- Advanced caching strategies

#### For 1M+ records
- Data warehouse (BigQuery, Redshift)
- Horizontal scaling (multiple servers)
- CDN for frontend assets
- Geo-replication

## Deployment Architecture

### Development
```
Local Machine
├── Backend (localhost:8000)
└── Frontend (localhost:3000)
```

### Production
```
Cloud Provider (AWS/GCP/Azure)
├── Load Balancer
├── Backend Servers (Gunicorn + Nginx)
│   └── PostgreSQL Database
├── Frontend CDN (S3 / CloudFront)
└── SSL/TLS Certificate
```

## Security Architecture

### Current
- No authentication (public data)
- No CORS enabled (local only)
- No rate limiting
- No logging or monitoring

### Production Recommendations

1. **Authentication**
   - JWT tokens for API access
   - Role-based access control

2. **API Security**
   - Rate limiting (100 req/min)
   - Request validation
   - SQL injection prevention
   - CORS configuration

3. **Data Security**
   - HTTPS/TLS encryption
   - Input sanitization
   - SQL parameterized queries

4. **Monitoring**
   - Application logging
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime monitoring

## Technology Decision Rationale

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Backend | FastAPI | Modern, fast, good for data APIs |
| Frontend | React | Popular, component-based, good ecosystem |
| Styling | Tailwind | Utility-first, fast development |
| Build Tool | Vite | Lightning fast, modern |
| Data Storage | Pandas/CSV | Simple for small datasets, easy to migrate |
| HTTP Client | Axios | Promise-based, clean API |
| Icons | Lucide | Modern, clean SVG icons |

## Future Architecture Evolution

### Phase 2 (1000+ records)
- [ ] PostgreSQL database integration
- [ ] Redis caching
- [ ] Advanced authentication
- [ ] API versioning

### Phase 3 (10,000+ records)
- [ ] Elasticsearch for full-text search
- [ ] Horizontal scaling
- [ ] Microservices architecture
- [ ] Message queue (RabbitMQ)

### Phase 4 (100,000+ records)
- [ ] Data warehousing
- [ ] Advanced analytics
- [ ] Machine learning integration
- [ ] Real-time data sync

---

**Related Documentation:**
- [API Overview](../api/overview.md)
- [Data Schema](./data-schema.md)
- [Development Guide](../frontend/development.md)

**Documentation Version**: 1.0.0
