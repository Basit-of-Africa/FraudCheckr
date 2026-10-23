# GET /convictions

Get all conviction records with pagination support.

## Endpoint Details

- **Method**: GET
- **Path**: `/convictions`
- **Response**: [PaginatedResponse](../overview.md#paginatedresponse)

## Query Parameters

| Parameter | Type | Required | Default | Max | Description |
|-----------|------|----------|---------|-----|-------------|
| `limit` | integer | No | 10 | 1000 | Records per page |
| `offset` | integer | No | 0 | - | Records to skip (for pagination) |

## Request Examples

### Get First 10 Records
```bash
curl "http://localhost:8000/convictions"
```

### Get 20 Records, Skip First 10
```bash
curl "http://localhost:8000/convictions?limit=20&offset=10"
```

### Get 100 Records Starting from Record 500
```bash
curl "http://localhost:8000/convictions?limit=100&offset=500"
```

## Response Example

```json
{
  "total": 7876,
  "limit": 10,
  "offset": 0,
  "data": [
    {
      "name": "JOHN DOE",
      "offense": "CYBER CRIME",
      "prison_term": "5 YEARS",
      "prison_term_months": 60,
      "fine": "5000000",
      "restitution": "1000000",
      "court": "FEDERAL HIGH COURT"
    },
    {
      "name": "JANE SMITH",
      "offense": "MONEY LAUNDERING",
      "prison_term": "10 YEARS",
      "prison_term_months": 120,
      "fine": "10000000",
      "restitution": null,
      "court": "SUPREME COURT"
    }
  ]
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `total` | integer | Total number of records in database |
| `limit` | integer | Number of records requested |
| `offset` | integer | Records skipped (pagination offset) |
| `data` | array | Array of conviction records |

## Error Responses

### 404 - No Data Loaded
```json
{
  "detail": "No conviction data loaded"
}
```

**Cause**: CSV file not found or failed to load.  
**Solution**: Ensure `data/convictions.csv` exists in project root.

### 400 - Invalid Offset
```json
{
  "error": "Offset 1000 exceeds total records 7876"
}
```

**Cause**: Offset parameter is larger than total records.  
**Solution**: Use offset value less than total records.

## JavaScript Examples

### Using Axios
```javascript
import axios from 'axios';

// Get first 20 records
const response = await axios.get('http://localhost:8000/convictions', {
  params: {
    limit: 20,
    offset: 0
  }
});

console.log(`Found ${response.data.total} total records`);
console.log(`Showing ${response.data.data.length} records`);
```

### Using Fetch API
```javascript
const limit = 20;
const offset = 0;

const response = await fetch(
  `http://localhost:8000/convictions?limit=${limit}&offset=${offset}`
);
const data = await response.json();

console.log(data);
```

## Pagination Pattern

```javascript
let offset = 0;
const limit = 20;
let hasMore = true;

while (hasMore) {
  const response = await api.getConvictions(limit, offset);
  
  // Process batch
  processBatch(response.data.data);
  
  // Check if more records exist
  hasMore = (offset + limit) < response.data.total;
  
  // Next batch
  offset += limit;
}
```

## Rate Limiting

Currently **no rate limiting**. In production, implement:
- 100 requests per minute per IP
- Clear rate-limit headers in response

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (invalid parameters) |
| 404 | Data not found |
| 500 | Server error |

---

**Related Endpoints**: [Search](./search.md) | [Filter by Offense](./offense.md) | [Filter by Court](./court.md)

**Documentation Version**: 1.0.0
