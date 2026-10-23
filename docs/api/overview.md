# API Overview

Nigeria's Fraud Conviction Records provides a comprehensive REST API for accessing and analyzing conviction records.

## API Basics

### Base URL
```
http://localhost:8000
```

### Response Format
All responses are in JSON format with the following structure:

```json
{
  "status": "success",
  "data": {},
  "error": null
}
```

### Standard HTTP Methods

- **GET** - Retrieve data
- **POST** - Create new data (not currently available)
- **PUT/PATCH** - Update data (not currently available)
- **DELETE** - Delete data (not currently available)

## Available Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Health check |
| GET | `/convictions` | Get all convictions (paginated) |
| GET | `/search` | Search by defendant name |
| GET | `/offense` | Filter by offense type |
| GET | `/court` | Filter by court |
| GET | `/stats` | Get statistics |

## Query Parameters

Most endpoints support these query parameters:

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `limit` | integer | 10 | 1000 | Records per page |
| `offset` | integer | 0 | - | Records to skip |

## Example Request

```bash
curl "http://localhost:8000/convictions?limit=10&offset=0"
```

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request |
| 404 | Not found |
| 500 | Server error |

## Documentation

Access interactive API documentation:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Detailed Endpoints

- [Health Check](./endpoints/health.md)
- [Get Convictions](./endpoints/convictions.md)
- [Search by Name](./endpoints/search.md)
- [Filter by Offense](./endpoints/offense.md)
- [Filter by Court](./endpoints/court.md)
- [Statistics](./endpoints/stats.md)

## Data Models

### ConvictionRecord

```json
{
  "name": "JOHN DOE",
  "offense": "CYBER CRIME",
  "prison_term": "5 YEARS",
  "prison_term_months": 60,
  "fine": "5000000",
  "restitution": "1000000",
  "court": "FEDERAL HIGH COURT"
}
```

### PaginatedResponse

```json
{
  "total": 7876,
  "limit": 10,
  "offset": 0,
  "data": [
    { "conviction_record": "..." }
  ]
}
```

### StatsResponse

```json
{
  "total_cases": 7876,
  "most_common_offense": "CYBERCRIME",
  "average_prison_term_months": 45.2,
  "unique_courts": 33,
  "unique_offenses": 50
}
```

## Error Handling

Errors are returned with appropriate HTTP status codes:

```json
{
  "error": "No conviction data loaded"
}
```

## Authentication

Currently, the API does not require authentication. All data is publicly available.

## Rate Limiting

No rate limiting is currently implemented. In production, this should be added.

## CORS

CORS is not enabled by default. To enable cross-origin requests, modify `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Next Steps

- [Explore Endpoints](./endpoints/health.md)
- [Frontend Integration](../frontend/overview.md)
- [Error Handling](./errors.md)

---

**Documentation Version**: 1.0.0  
**Last Updated**: March 30, 2026
