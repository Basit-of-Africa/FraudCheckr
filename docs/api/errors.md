# Error Handling

Error codes and handling strategies for Nigeria's Fraud Conviction Records API.

## HTTP Status Codes

### Success Codes

| Code | Name | Usage |
|------|------|-------|
| 200 | OK | Request successful, data returned |
| 201 | Created | New resource created (not used currently) |

### Client Error Codes

| Code | Name | Cause |
|------|------|-------|
| 400 | Bad Request | Invalid query parameters |
| 401 | Unauthorized | Authentication required (future) |
| 404 | Not Found | Endpoint or data not found |
| 422 | Unprocessable Entity | Invalid data format |
| 429 | Too Many Requests | Rate limit exceeded (future) |

### Server Error Codes

| Code | Name | Cause |
|------|------|-------|
| 500 | Internal Server Error | Unexpected server error |
| 502 | Bad Gateway | Server temporarily unavailable |
| 503 | Service Unavailable | Server maintenance |

## Error Response Format

```json
{
  "error": "Error message describing what went wrong",
  "status_code": 400,
  "timestamp": "2026-03-30T10:30:00Z"
}
```

## Common Errors

### No Data Loaded

```json
{
  "error": "No conviction data loaded"
}
```

**Cause**: CSV file not found or failed to load  
**Solution**: Ensure `data/convictions.csv` exists in project root

### Invalid Offset

```json
{
  "error": "Offset 1000 exceeds total records 7876"
}
```

**Cause**: Offset parameter too large  
**Solution**: Use valid offset (0 to total-1)

### Missing Parameter

```json
{
  "error": "Query parameter \"name\" is required"
}
```

**Cause**: Required parameter missing  
**Solution**: Include required parameters in request

## Error Handling Examples

### Python/Requests

```python
import requests

try:
    response = requests.get('http://localhost:8000/convictions')
    response.raise_for_status()
    data = response.json()
except requests.exceptions.HTTPError as e:
    print(f"HTTP Error: {e.response.status_code}")
    print(f"Message: {e.response.json()}")
except requests.exceptions.RequestException as e:
    print(f"Request Error: {e}")
```

### JavaScript/Axios

```javascript
import axios from 'axios';

try {
    const response = await axios.get('http://localhost:8000/convictions');
    console.log(response.data);
} catch (error) {
    if (error.response) {
        // Server responded with error
        console.error('Status:', error.response.status);
        console.error('Message:', error.response.data.error);
    } else {
        // Request failed
        console.error('Error:', error.message);
    }
}
```

## Debugging Tips

1. **Enable Verbose Logging**
   ```bash
   # Backend
   uvicorn main:app --log-level debug
   ```

2. **Check Network Tab** (Browser DevTools)
   - See actual requests and responses
   - Check status codes
   - Inspect response body

3. **Use Swagger API Docs**
   - [http://localhost:8000/docs](http://localhost:8000/docs)
   - Try endpoints interactively
   - See request/response schemas

4. **Manual Testing with cURL**
   ```bash
   curl -v http://localhost:8000/convictions
   ```

See [Troubleshooting Guide](../troubleshooting.md) for more help.
