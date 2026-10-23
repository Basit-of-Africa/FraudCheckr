# Nigeria's Fraud Conviction Records Explorer

A FastAPI backend for searching and analysing fraud conviction records published by Nigeria's Economic and Financial Crimes Commission (EFCC) in its yearly *Narrative of Convictions* tables (2020 to 2024). The convictions were handed down in Federal, State and FCT High Courts.

## 🎯 Features

- **Reproducible dataset**: `scripts/build_dataset.py` rebuilds `data/convictions.csv` from the EFCC source tables, with stable record IDs and per-record quality flags
- **Search & Filter**: Search by defendant name, offense type, or court
- **Analytics**: Generate statistics on conviction patterns
- **Pagination**: All endpoints support limit/offset pagination
- **Type Safety**: Full Pydantic models and type hints
- **API Documentation**: Auto-generated OpenAPI/Swagger docs

## 📂 Project Structure

```
efcc-convictions-explorer/
├── main.py                    # FastAPI application & endpoints
├── models.py                  # Pydantic data models
├── dataset.py                 # Loads data/convictions.csv for the API
├── scripts/build_dataset.py   # Rebuilds the dataset from the EFCC source tables
├── data/
│   ├── convictions.csv        # Canonical dataset (single source of truth)
│   ├── excluded_rows.csv      # Source rows dropped, with reasons
│   ├── QUALITY_REPORT.md      # Generated coverage and quality report
│   ├── README.md              # Data dictionary and methodology
│   └── source/                # EFCC source tables, unmodified
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## 🧹 The dataset

`data/convictions.csv` is the single source of truth. It is generated, never edited by hand:

```bash
python scripts/build_dataset.py
```

See [`data/README.md`](data/README.md) for the field definitions, how the source was cleaned, what is
deliberately left out, and what each quality flag means. [`data/QUALITY_REPORT.md`](data/QUALITY_REPORT.md)
shows coverage and flag counts for the current build.

## 🚀 Quick Start

### 1. Setup

```bash
# Navigate to project directory
cd efcc-convictions-explorer

# Create Python virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Data

The dataset ships with the repository in `data/convictions.csv`. To rebuild it after changing the
source tables or the build script:

```bash
python scripts/build_dataset.py
```

Set `CONVICTIONS_CSV` to load a different file.

### 3. Run the Server

```bash
# Start the FastAPI server
python main.py

# Or using uvicorn directly:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Output should show:
```
Loaded 7885 conviction records from data/convictions.csv
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## 📡 API Endpoints

### Health Check
```http
GET /
```
Returns API status and record count.

**Response:**
```json
{
  "status": "operational",
  "message": "EFCC Convictions Explorer is running. Loaded 1234 records."
}
```

---

### Get All Convictions
```http
GET /convictions?limit=10&offset=0
```

Query parameters:
- `limit` (int, 1-1000): Records per page (default: 10)
- `offset` (int): Records to skip (default: 0)

**Response:**
```json
{
  "total": 1234,
  "limit": 10,
  "offset": 0,
  "data": [
    {
      "name": "JOHN DOE",
      "offense": "FRAUD",
      "prison_term": "5 YEARS",
      "prison_term_months": 60,
      "fine": "5000000",
      "restitution": "1000000",
      "court": "FEDERAL HIGH COURT"
    }
  ]
}
```

---

### Search by Name
```http
GET /search?name=JOHN&limit=10&offset=0
```

Query parameters:
- `name` (string, required): Defendant name (partial match, case-insensitive)
- `limit` (int, 1-1000): Records per page
- `offset` (int): Records to skip

**Example:**
```bash
curl "http://localhost:8000/search?name=DOE"
```

---

### Filter by Offense
```http
GET /offense?type=FRAUD&limit=10&offset=0
```

Query parameters:
- `type` (string, required): Offense type (partial match)
- `limit` (int): Records per page
- `offset` (int): Records to skip

**Example:**
```bash
curl "http://localhost:8000/offense?type=MONEY%20LAUNDERING"
```

---

### Filter by Court
```http
GET /court?name=FEDERAL&limit=10&offset=0
```

Query parameters:
- `name` (string, required): Court name (partial match)
- `limit` (int): Records per page
- `offset` (int): Records to skip

**Example:**
```bash
curl "http://localhost:8000/court?name=FEDERAL%20HIGH%20COURT"
```

---

### Get Statistics
```http
GET /stats
```

**Response:**
```json
{
  "total_cases": 1234,
  "most_common_offense": "FRAUD",
  "average_prison_term_months": 48.5,
  "unique_courts": 12,
  "unique_offenses": 28
}
```

## 📖 Interactive API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These provide interactive endpoint testing and full schema documentation.

## 🔍 Example Usage

### Using curl

```bash
# Health check
curl http://localhost:8000/

# List all convictions (first 5)
curl "http://localhost:8000/convictions?limit=5"

# Search for a defendant
curl "http://localhost:8000/search?name=ABUBAKAR"

# Get fraud convictions
curl "http://localhost:8000/offense?type=FRAUD"

# Get convictions from a specific court
curl "http://localhost:8000/court?name=FEDERAL"

# Get statistics
curl http://localhost:8000/stats
```

### Using Python

```python
import requests

BASE_URL = "http://localhost:8000"

# Get all convictions
response = requests.get(f"{BASE_URL}/convictions", params={"limit": 10})
data = response.json()
print(f"Total records: {data['total']}")

# Search by name
response = requests.get(f"{BASE_URL}/search", params={"name": "DOE", "limit": 5})
results = response.json()
print(f"Found {results['total']} matches")

# Get stats
stats = requests.get(f"{BASE_URL}/stats").json()
print(f"Most common offense: {stats['most_common_offense']}")
print(f"Average prison term: {stats['average_prison_term_months']} months")
```

## 📋 Data Models

### ConvictionRecord
```python
{
  "name": str,              # Defendant name (uppercase)
  "offense": str,           # Offense type (uppercase)
  "prison_term": str,       # Standardized term (e.g., "5 YEARS", "LIFE")
  "prison_term_months": int | null,  # Numeric months (null for LIFE)
  "fine": str | null,       # Fine amount (digits only, ₦ removed)
  "restitution": str | null,  # Restitution (digits only)
  "court": str              # Court name (uppercase)
}
```

### StatsResponse
```python
{
  "total_cases": int,
  "most_common_offense": str,
  "average_prison_term_months": float | null,
  "unique_courts": int,
  "unique_offenses": int
}
```

## ⚙️ Configuration

### Prison Term Conversion

Prison terms are automatically converted to months:
- `YEARS` → multiplied by 12
- `MONTHS` → kept as-is
- `WEEKS` → divided by 4.4 (approx)
- `DAYS` → divided by 30 (approx)
- `LIFE` → null (no numeric conversion)

### Multiple Defendants

Each named defendant gets their own record (e.g. `FC2021-0611-1`, `FC2021-0611-2`), with the others
listed in `co_defendants`. Unnamed co-defendants ("& 2 ORS") are counted, not invented.

## 🐛 Troubleshooting

### "Conviction dataset not found"
Run `python scripts/build_dataset.py` to regenerate `data/convictions.csv`.

### Port 8000 already in use
```bash
# Use a different port
uvicorn main:app --port 8001
```

### Module import errors
```bash
# Ensure virtual environment is activated and dependencies installed
pip install -r requirements.txt
```

### No data loaded
Check the server log for the path it tried, and that `data/convictions.csv` exists.

## 📊 Data Quality Notes

Records are only as accurate as the EFCC's published tables. Known issues are flagged per record in
`quality_flags` rather than silently "fixed"; see `data/README.md`. A name match is not proof that a
person was convicted: always confirm identity using the charge number, court and date with the court
registry before relying on a record.

## 📝 License

This project processes publicly available data from the EFCC. Use in accordance with applicable laws and data usage policies.

## 🤝 Support

For issues or improvements, review:
1. The [API documentation](#-interactive-api-documentation) at `/docs`
2. Console output for data loading warnings
3. Python error messages for debugging

---

**Built with:** FastAPI • Pandas • Pydantic
